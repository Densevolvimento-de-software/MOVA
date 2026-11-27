import { pathToFileURL } from "node:url";

const MAX_CHANGED_LINES = 300;
const REQUIRED_SECTIONS = [
  "Issue vinculada",
  "Objetivo",
  "Escopo",
  "Critérios de aceitação e cenários cobertos",
  "Validações",
  "Risco, release e rollback",
  "Instruções de revisão",
  "Checklist",
];
const REQUIRED_FIELDS = [
  ["Escopo", "Incluído"],
  ["Escopo", "Fora do escopo"],
  ["Validações", "Comandos executados e resultados observados"],
  ["Validações", "Validações não executadas e motivo"],
  ["Risco, release e rollback", "Justificativa, superfícies afetadas, impacto possível e reversibilidade"],
  ["Risco, release e rollback", "Release necessária ou motivo para não se aplicar"],
  ["Risco, release e rollback", "Estratégia de rollback ou motivo para não se aplicar"],
];
const ERROR_MESSAGES = {
  missing_body: "A descrição da PR está vazia.",
  missing_section: "Falta uma seção obrigatória na descrição da PR.",
  empty_section: "Há uma seção obrigatória vazia.",
  empty_field: "Há um campo obrigatório sem valor.",
  missing_issue: "A seção Issue vinculada precisa conter Closes #<número>.",
  invalid_risk: "Risco deve ser LOW, MEDIUM, HIGH ou CRITICAL.",
  diff_stats_missing: "Não foi possível obter as estatísticas do diff da PR.",
  diff_limit: "Diff acima de 300 linhas somando adições e remoções.",
};

function cleanMarkdown(value) {
  let fenceCharacter = null;
  let fenceLength = 0;

  return value.replace(/<!--[\s\S]*?-->/g, "").split(/\r?\n/).filter((line) => {
    const opening = line.match(/^ {0,3}(`{3,}|~{3,})/u);
    if (fenceCharacter === null) {
      if (!opening) return true;
      fenceCharacter = opening[1][0];
      fenceLength = opening[1].length;
      return false;
    }

    const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/u);
    if (closing && closing[1][0] === fenceCharacter && closing[1].length >= fenceLength) {
      fenceCharacter = null;
      fenceLength = 0;
    }
    return false;
  }).join("\n").trim();
}

function parseSections(body) {
  const headings = [...body.matchAll(/^##[ \t]+([^\r\n]+?)[ \t]*$/gm)];
  const sections = new Map();

  for (const [index, heading] of headings.entries()) {
    const name = heading[1].trim();
    if (!sections.has(name)) {
      sections.set(name, body.slice(heading.index + heading[0].length, headings[index + 1]?.index ?? body.length));
    }
  }

  return sections;
}

function fieldValue(section, label) {
  const line = section?.split(/\r?\n/).find((value) => {
    if (!/^ {0,3}- /u.test(value)) {
      return false;
    }

    return value.trimStart().slice(2).startsWith(`${label}:`);
  });

  return line?.trimStart().slice(label.length + 3).trim() ?? null;
}

function isMeaningful(value) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 && !/^(?:\.{2,}|…|<[^>]+>|\[[^\]]+\]|TODO|TBD|PREENCHER)$/iu.test(normalized);
}

export function validatePullRequestDescription({ body, additions, deletions }) {
  const errors = [];
  const hasBody = typeof body === "string" && body.trim().length > 0;

  if (!hasBody) {
    errors.push("missing_body");
  }

  if (hasBody) {
    const sections = parseSections(cleanMarkdown(body));

    for (const name of REQUIRED_SECTIONS) {
      if (!sections.has(name)) {
        errors.push("missing_section");
      } else if (!isMeaningful(sections.get(name))) {
        errors.push("empty_section");
      }
    }

    const issueSection = sections.get("Issue vinculada") ?? "";
    const hasLinkedIssue = issueSection.split(/\r?\n/).some((line) =>
      /^ {0,3}(?:-\s*)?(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s+#\d+\b/iu.test(line));
    if (!hasLinkedIssue) {
      errors.push("missing_issue");
    }

    for (const [sectionName, label] of REQUIRED_FIELDS) {
      const value = fieldValue(sections.get(sectionName), label);
      if (!isMeaningful(value)) {
        errors.push("empty_field");
      }
    }

    const riskLines = (sections.get("Risco, release e rollback") ?? "")
      .split(/\r?\n/).filter((line) => /^ {0,3}-\s*Risco:/iu.test(line));
    if (riskLines.length !== 1 || !/^ {0,3}-\s*Risco:\s*(?:LOW|MEDIUM|HIGH|CRITICAL)\s*$/iu.test(riskLines[0] ?? "")) {
      errors.push("invalid_risk");
    }
  }

  if (!Number.isSafeInteger(additions) || additions < 0
    || !Number.isSafeInteger(deletions) || deletions < 0) {
    errors.push("diff_stats_missing");
  } else if (additions + deletions > MAX_CHANGED_LINES) {
    errors.push("diff_limit");
  }

  return [...new Set(errors)];
}

async function validateCurrentPullRequest() {
  const token = process.env.GITHUB_TOKEN;
  const apiBase = process.env.GITHUB_API_URL;
  const repository = process.env.GITHUB_REPOSITORY;
  const pullNumber = process.env.PR_NUMBER;

  if (!token || !apiBase || !repository || !pullNumber
    || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(repository)
    || !/^[1-9]\d*$/u.test(pullNumber)) {
    throw new Error("Configuração inválida para validar a PR.");
  }

  const base = apiBase.replace(/\/+$/u, "");
  const url = new URL(`${base}/repos/${repository}/pulls/${pullNumber}`);
  if (url.protocol !== "https:") {
    throw new Error("A API do GitHub precisa usar HTTPS.");
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`Não foi possível consultar a PR (HTTP ${response.status}).`);
  }

  const pullRequest = await response.json();
  const errors = validatePullRequestDescription({
    body: pullRequest.body,
    additions: pullRequest.additions,
    deletions: pullRequest.deletions,
  });

  if (errors.length > 0) {
    for (const code of errors) {
      process.stderr.write(`::error::${ERROR_MESSAGES[code]}\n`);
    }
    process.exitCode = 1;
    return;
  }

  process.stdout.write("Política de descrição e tamanho da PR validada.\n");
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  validateCurrentPullRequest().catch((error) => {
    const message = error instanceof Error ? error.message : "Erro inesperado na validação da PR.";
    process.stderr.write(`::error::${message}\n`);
    process.exitCode = 1;
  });
}
