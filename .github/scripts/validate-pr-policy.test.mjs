import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { validatePullRequestDescription } from "./validate-pr-policy.mjs";

const section = (...lines) => lines.join("\n");
const validBody = [
  section("## Issue vinculada", "Closes #24", "## Objetivo", "Validar automaticamente a política de pull requests."),
  section("## Escopo", "- Incluído: validação de descrição e diff.", "- Fora do escopo: deploy."),
  section("## Critérios de aceitação e cenários cobertos", "O fluxo rejeita descrições incompletas e diffs acima do limite."),
  section("## Validações", "- Comandos executados e resultados observados: `node --test` passou.", "- Validações não executadas e motivo: nenhuma."),
  section("## Risco, release e rollback", "- Risco: LOW", "- Justificativa, superfícies afetadas, impacto possível e reversibilidade: validação sem deploy.", "- Release necessária ou motivo para não se aplicar: não se aplica.", "- Estratégia de rollback ou motivo para não se aplicar: reverter o workflow."),
  section("## Instruções de revisão", "Conferir casos válidos e inválidos e revisar as permissões do workflow."),
  section("## Checklist", "- [x] Cenários relevantes cobertos."),
].join("\n");

const validate = (body = validBody, additions = 1, deletions = 1) => validatePullRequestDescription({ body, additions, deletions });

test("accepts a complete description when additions plus deletions equal 300", () =>
  assert.deepEqual(validate(validBody, 150, 150), []));
test("rejects a diff when additions plus deletions exceed 300", () =>
  assert.ok(validate(validBody, 151, 150).includes("diff_limit")));
test("rejects a missing required section", () =>
  assert.ok(validate(validBody.replace("## Objetivo\nValidar automaticamente a política de pull requests.\n", ""))
    .includes("missing_section")));
test("ignores policy-looking headings inside fenced code blocks", () => {
  assert.ok(validate(`\`\`\`md\n${validBody}\n\`\`\``).includes("missing_section"));
});

const requiredFieldExamples = [
  ["- Incluído: validação de descrição e diff.", "- Incluído:"],
  ["- Fora do escopo: deploy.", "- Fora do escopo:"],
  ["- Comandos executados e resultados observados: `node --test` passou.", "- Comandos executados e resultados observados:"],
  ["- Validações não executadas e motivo: nenhuma.", "- Validações não executadas e motivo:"],
  ["- Justificativa, superfícies afetadas, impacto possível e reversibilidade: validação sem deploy.", "- Justificativa, superfícies afetadas, impacto possível e reversibilidade:"],
  ["- Release necessária ou motivo para não se aplicar: não se aplica.", "- Release necessária ou motivo para não se aplicar:"],
  ["- Estratégia de rollback ou motivo para não se aplicar: reverter o workflow.", "- Estratégia de rollback ou motivo para não se aplicar:"],
];

test("rejects empty required fields and template-only placeholders", () => {
  for (const [filled, empty] of requiredFieldExamples) {
    assert.ok(validate(validBody.replace(filled, empty)).includes("empty_field"));
  }
  assert.ok(validate(validBody.replace("Validar automaticamente a política de pull requests.", "<!-- preencher -->"))
    .includes("empty_section"));
});

test("rejects a missing linked issue", () =>
  assert.ok(validate(validBody.replace("Closes #24", "    Closes #24")).includes("missing_issue")));
test("rejects invalid, duplicate, or indented risk declarations", () => {
  const riskCases = ["- Risco: urgent", "- Risco: LOW\n- Risco: urgent", "    - Risco: LOW"];
  for (const risk of riskCases) {
    assert.ok(validate(validBody.replace("- Risco: LOW", risk)).includes("invalid_risk"));
  }
});
test("fails closed when body or diff statistics are missing", () => {
  assert.deepEqual(validate("", 1, 1), ["missing_body"]);
  assert.ok(validate(validBody, null, 0).includes("diff_stats_missing"));
});
test("treats shell-like text in the description as ordinary content", () => {
  const payload = "$(touch SHOULD_NOT_RUN)";
  const body = validBody.replace("política de pull requests.", `política de pull requests. ${payload}`);
  assert.deepEqual(validate(body), []);
});
test("keeps GitHub expressions out of shell commands", () => {
  const workflow = readFileSync(new URL("../workflows/pr-policy.yml", import.meta.url), "utf8");
  assert.doesNotMatch(workflow, /^\s*(?:pull_request_target\s*:|run:\s*[|>]|[A-Za-z0-9_-]+:\s*write(?:-all)?\s*$)|^\s*run:[^\r\n]*\$\{\{/mi);
});
