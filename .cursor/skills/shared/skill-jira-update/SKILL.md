---
name: jira-update
description: Safely update Jira cards by reading card information, identifying changes, and adding structured comments using the official Atlassian MCP. Use when updating Jira cards with progress, changes, or status updates.
---

# Jira Card Update Skill

This skill provides a safe, structured approach to updating Jira cards by reading card information, identifying changes, and adding professional comments using the official Atlassian MCP.

## Critical Prerequisites

### MCP Availability Check (MANDATORY)

**BEFORE any action, you MUST verify if the official Atlassian MCP is available.**

**If the MCP is NOT available:**
- Display ONLY this message:
  ```
  MCP oficial da Atlassian não foi localizado. Nenhuma ação foi executada.
  ```
- Do NOT attempt to comment, update, or simulate any action on Jira
- Do NOT proceed with any Jira-related operations

**If the MCP is available:**
- Proceed with the workflow below
- Use ONLY official Atlassian MCP tools
- Never use unofficial integrations or alternatives

## Workflow

### Step 1: Request Jira Card Link (MANDATORY)

**You MUST explicitly ask the user for the Jira card link.**

**❌ DO NOT:**
- Assume or infer which card to update
- Use cards from conversation history without explicit confirmation
- Proceed without the link

**✅ DO:**
- Ask clearly: "Por favor, forneça o link do card do Jira que deve ser atualizado."
- Wait for the user to provide the link
- Only continue after receiving the link

**Example:**
```
Por favor, forneça o link do card do Jira que deve ser atualizado.
```

### Step 2: Extract Card Information

From the provided Jira URL, extract:
- **Cloud ID**: From URL format `https://yoursite.atlassian.net/...`
- **Issue Key**: From URL or issue ID (e.g., `PROJ-123`)

**URL Patterns:**
- `https://yoursite.atlassian.net/browse/PROJ-123`
- `https://yoursite.atlassian.net/jira/software/projects/PROJ/boards/1/backlog?selectedIssue=PROJ-123`
- Issue key format: `PROJECT-KEY-NUMBER` (e.g., `PROJ-123`)

### Step 3: Read and Analyze Card

**Use official Atlassian MCP tools to read the card:**

1. **Get Cloud ID** (if needed):
   - Use `getAccessibleAtlassianResources` to get available cloud IDs
   - Or extract from URL: `https://yoursite.atlassian.net` → cloud ID

2. **Read Issue:**
   - Use `getJiraIssue` with cloud ID and issue key
   - Retrieve:
     - Title/Summary
     - Description
     - Current status
     - Assignee
     - Labels
     - Priority
     - Due date
     - Custom fields (if relevant)

3. **Read Comments:**
   - Use `getJiraIssue` with `expand` parameter or `addCommentToJiraIssue` context
   - Review existing comments to understand:
     - Last update context
     - Previous changes mentioned
     - Communication history

4. **Read History (if available):**
   - Check issue changelog for:
     - Status transitions
     - Field changes
     - Assignment changes
     - Date changes

### Step 4: Identify Changes

**Compare current state with previous state (from comments/history):**

**Changes to identify:**
- ✅ Status changes (e.g., "In Progress" → "In Review")
- ✅ Description updates
- ✅ New comments added
- ✅ Assignee changes
- ✅ Due date changes
- ✅ Priority changes
- ✅ Label changes
- ✅ Scope or requirements changes
- ✅ Any other significant changes

**If no previous state available:**
- Note: "Primeira atualização do card"
- Focus on current state and next steps

### Step 5: Create Structured Comment

**Use the MANDATORY comment template:**

```markdown
---
🔄 **Atualização do Card**

**O que mudou:**
- [Lista objetiva das alterações identificadas, uma por linha]
- [Seja específico e claro]
- [Mencione apenas mudanças reais identificadas]

**Impacto:**
- [Breve explicação do impacto técnico ou de negócio, se aplicável]
- [Ou "Nenhum impacto significativo" se não houver]

**Próximos passos:**
- [Ações esperadas ou recomendações]
- [Ou "Aguardando feedback" se não houver ações definidas]

_(Comentário gerado automaticamente)_
---
```

**Template Rules:**
- Use exactly this structure
- Fill only with real, identified information
- Do NOT invent information
- Do NOT add redundant information already in comments
- Keep language clear, objective, and professional

### Step 6: Add Comment to Jira

**Use ONLY official Atlassian MCP:**

1. **Verify MCP availability** (again before action)
2. **Use `addCommentToJiraIssue` tool:**
   - `cloudId`: Extracted from URL or resources
   - `issueIdOrKey`: Issue key (e.g., `PROJ-123`)
   - `commentBody`: The structured comment from Step 5 (in Markdown format)

**Example:**
```typescript
// Pseudo-code for reference
addCommentToJiraIssue({
  cloudId: "extracted-cloud-id",
  issueIdOrKey: "PROJ-123",
  commentBody: "---\n🔄 **Atualização do Card**\n\n**O que mudou:**\n- Status alterado de 'In Progress' para 'In Review'\n- Descrição atualizada com novos requisitos\n\n**Impacto:**\n- Mudança de status indica progresso na implementação\n\n**Próximos passos:**\n- Aguardando revisão do código\n\n_(Comentário gerado automaticamente)_\n---"
})
```

## Best Practices

### ✅ DO:

1. **Always verify MCP availability first**
2. **Request link explicitly** - Never assume
3. **Read card completely** - Get all relevant information
4. **Identify real changes** - Only mention actual changes
5. **Use structured template** - Follow the exact format
6. **Clear, professional language** - Objective and concise
7. **Avoid redundancy** - Don't repeat information from previous comments
8. **Be accurate** - Only include verified information

### ❌ DON'T:

1. **Never proceed without MCP verification**
2. **Never assume card identity** - Always ask for link
3. **Never invent information** - Only use what's in the card
4. **Never use unofficial tools** - Only official Atlassian MCP
5. **Never skip template** - Always use the structured format
6. **Never be redundant** - Avoid repeating previous comments
7. **Never update card fields** - Only add comments (unless explicitly requested)
8. **Never proceed if MCP unavailable** - Show error message only

## Error Handling

### MCP Not Available

**Response:**
```
MCP oficial da Atlassian não foi localizado. Nenhuma ação foi executada.
```

**Actions:**
- Do NOT attempt any workaround
- Do NOT suggest alternative methods
- Simply inform the user

### Card Not Found

**Response:**
```
Não foi possível localizar o card do Jira com o link fornecido.
Por favor, verifique o link e tente novamente.
```

### Access Denied

**Response:**
```
Não foi possível acessar o card do Jira. Verifique as permissões de acesso.
```

### Invalid Link Format

**Response:**
```
O link fornecido não está em um formato válido de Jira.
Por favor, forneça um link completo do card (ex: https://yoursite.atlassian.net/browse/PROJ-123).
```

## Example Workflow

### User Request:
```
Atualize o card do Jira com as mudanças recentes.
```

### Agent Response (Step 1):
```
Por favor, forneça o link do card do Jira que deve ser atualizado.
```

### User Provides Link:
```
https://mysite.atlassian.net/browse/PROJ-456
```

### Agent Actions:
1. ✅ Verify MCP availability
2. ✅ Extract cloud ID and issue key
3. ✅ Read card information
4. ✅ Read existing comments
5. ✅ Identify changes
6. ✅ Create structured comment
7. ✅ Add comment using MCP

### Agent Response:
```
Card do Jira atualizado com sucesso.

Comentário adicionado seguindo o template estruturado:
- Identificadas mudanças de status e descrição
- Impacto e próximos passos documentados
```

## Key Principles

1. **Safety First**: Always verify MCP availability
2. **Explicit Confirmation**: Never assume card identity
3. **Accurate Information**: Only use verified data
4. **Structured Communication**: Follow template exactly
5. **Professional Language**: Clear, objective, concise
6. **No Redundancy**: Avoid repeating previous information
7. **Official Tools Only**: Use only Atlassian MCP

## MCP Tools Reference

**Required Atlassian MCP Tools:**
- `getAccessibleAtlassianResources` - Get available cloud IDs
- `getJiraIssue` - Read issue information
- `addCommentToJiraIssue` - Add comment to issue

**Never use:**
- Unofficial Jira APIs
- Web scraping
- Alternative integrations
- Simulated actions

---

**Remember**: This skill prioritizes safety, accuracy, and professional communication. Always verify MCP availability, request explicit confirmation, and use only official tools.
