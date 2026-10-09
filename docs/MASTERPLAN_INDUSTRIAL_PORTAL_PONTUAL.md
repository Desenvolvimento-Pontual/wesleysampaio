# MASTERPLAN INDUSTRIAL E OPERACIONAL — PORTAL LOGÍSTICO PONTUAL BRASIL
## Arquitetura de Fluxos, Esteiras de Ilhas, Faturamento, Descarga e Governança B2B

Este documento substitui qualquer visão simplista anterior e estabelece o **masterplan industrial, operacional e comercial definitivo** para o Portal Logístico da **Pontual Brasil Petróleo Ltda**. O fluxo foi desenhado com rigor industrial (nível Enterprise), refletindo exatamente a realidade operacional de bases de combustíveis de alta performance (inspirado nos padrões de Raízen, Ipiranga/PORTRAN, Inpasa e Vibra Energia), cobrindo todo o ciclo de vida da carga — da liberação de saldo de descarga ao faturamento, carregamento na ilha e emissão documental.

---

## 1. Matriz de Perfis e Acesso (Separação Absoluta)

O portal é dividido em dois grandes ecossistemas que compartilham a mesma base transacional:

| Perfil | Ambiente | Responsabilidades e Escopo de Acesso |
|---|---|---|
| **Cessionário / Cliente (Gestor)** | Portal Externo (B2B) | Consulta de saldo de cota/descarga livre, gestão de aditivos, vinculação de transportadoras credenciadas, emissão de relatórios de retirada e extratos. |
| **Transportadora (Agendador)** | Portal Externo (B2B) | Agendamento de grades (respeitando saldo liberado e trava por placa), cadastro de frotas (CIPP/CIV), cadastro de motoristas (CNH/MOPP) e upload dos documentos fiscais de transporte (CT-e, MDF-e). |
| **Portaria & Pátio** | Sistema Interno | Realização de check-in via totem ou leitura QR Code, validação georreferenciada (pátio regulador), inspeção SST (checklist veicular com fotos) e pesagem inicial (Tara). |
| **Fiscal / Triagem** | Sistema Interno | Análise e cruzamento automático de CT-e, MDF-e e NF-e com o pedido/saldo do cliente via Sefaz e ERP. Aprovação ou rejeição com justificativa. |
| **Dispatcher (Torre de Controle)** | Sistema Interno | Gestão do YMS (Yard Management System), mapa gráfico de ilhas em tempo real, ordenação da fila de espera (`Standby`) e disparo de chamadas (`Call-Up`). |
| **Operador de Ilha (Chão de Fábrica)** | Sistema Interno | Supervisão física do carregamento, monitoramento de intertravamentos de segurança (CLP / OPC-UA), liberação de preset, parada de emergência e **fechamento da carga** (gatilho para o faturamento). |
| **Faturamento & Fisco (Pontual)** | Sistema Interno | Emissão das Notas Fiscais de Venda/Saída da Pontual, liberação do manifesto de carga e liberação sistêmica para a transportadora gerar seus documentos finais. |

---

## 2. O Ciclo Operacional Completo: Passo a Passo (To-Be)

O fluxo industrial do Portal Pontual não é apenas um "agendamento de horário", mas uma esteira sequencial rigorosa onde o caminhão e o pedido avançam por status auditados:

### Fase 1: Liberação de Saldo e Agendamento de Descarga/Carga
1. **Liberação de Saldo pela Pontual:** O setor comercial/financeiro da Pontual Brasil cadastra no sistema o saldo livre (cota de retirada ou contrato de cessão) para o Cessionário/Cliente.
2. **Seleção de Slot (Agendamento):** O Cessionário (ou a Transportadora credenciada por ele) acessa o Portal B2B, visualiza o saldo disponível e seleciona uma janela horária (grade) na base (ex: Paulínia), vinculando a placa do cavalo mecânico e o motorista.
3. **Validação da Trava por Placa Universal:** Antes de confirmar o slot, o motor de regras executa a query: *A placa informada possui alguma grade ativa (`AGENDADO` até `CARREGADO`) para hoje na mesma planta?*
   - Se **Sim**: O sistema rejeita imediatamente com erro 409 (*Conflito: Placa já possui grade ativa no dia*).
   - Se **Não**: A grade é confirmada, a cota/crédito é reservada e a placa é travada para o dia.

### Fase 2: Pré-Embarque e Triagem Documental
1. **Envio de Documentos pela Transportadora:** A transportadora faz o upload do CT-e, MDF-e e comprovação de apólices no portal.
2. **Auditoria Fiscal Automática:** O sistema cruza os dados do CT-e/MDF-e com a Sefaz e com o pedido de compra (volumes, pesos, CNPJs).
3. **Aprovação do Fiscal (Pontual):** O analista fiscal interno revisa eventuais pendências e aprova a triagem. O status muda para `AUTORIZADO_EM_TRANSITO`.
4. **Geração do Bilhete Digital:** O portal emite um QR Code dinâmico (JWT assinado) para o aplicativo do motorista.

### Fase 3: Chegada na Base e Check-in (Pátio Regulador)
1. **Geofencing / Chegada:** Ao se aproximar da base (raio de 20 km), o motorista realiza o check-in remoto pelo aplicativo (*Pátio Regulador Digital*). Se a base estiver lotada, aguarda no bolsão virtual.
2. **Portaria Física:** Ao encostar no totem, o motorista apresenta o QR Code. O sistema valida a identidade, a CNH/MOPP, o CIPP do tanque e realiza o **Checklist SST** (inspeção de EPIs, extintores e vazamentos).
3. **Pesagem de Entrada (Tara):** O veículo passa pela balança rodoviária, capturando automaticamente o peso vazio (Tara) integrado via API/Serial.

### Fase 4: A Esteira de Status da Ilha (Core Operacional)
Esta é a esteira que controla o caminhão fisicamente na base e atualiza a visibilidade em tempo real para o cliente:

*   **Status 1: `CHEGOU_NA_BASE`**
    *   *Gatilho:* Check-in realizado na portaria e tara capturada na balança.
    *   *Visibilidade para o Cliente:* O cessionário visualiza no portal que o veículo da transportadora já se apresentou na planta da Pontual e está aguardando chamada.
*   **Status 2: `AGUARDANDO_CARREGAMENTO`**
    *   *Gatilho:* O veículo concluiu a inspeção SST e foi inserido na fila dinâmica de espera (`Standby`).
    *   *Ação da Torre de Controle:* O Dispatcher monitora o mapa de ilhas e, assim que uma baia fica livre, executa o **Call-Up** (chamada para baia via painel de LED e push no app).
*   **Status 3: `EM_CARREGAMENTO`**
    *   *Gatilho:* O veículo encosta na ilha (ex: Ilha 03 - Diesel S10). O operador valida o intertravamento físico (aterramento conectado, válvulas abertas).
    *   *Operação:* O sistema libera o **Preset** do CLP. O carregamento é monitorado segundo a vazão em tempo real (L/min). Ao atingir o volume exato, o braço fecha automaticamente.
*   **Status 4: `CARREGAMENTO_FINALIZADO`**
    *   *Gatilho:* O operador de ilha clica em "Finalizar Carga" após a desconexão segura dos mangotes.
    *   *Visibilidade:* A carga foi fisicamente concluída na ilha. O veículo se desloca para a balança de saída.
*   **Status 5: `AGUARDANDO_FATURAMENTO`**
    *   *Gatilho:* O caminhão passa na balança de saída para a captura do **Peso Bruto** (gerando o peso líquido).
    *   *Ação do Sistema:* O fechamento da carga é encaminhado para o módulo de Faturamento da Pontual. O faturista emite a **Nota Fiscal de Venda/Saída da Pontual** e o Manifesto de Carga correspondente.
*   **Status 6: `AGUARDANDO_DOCUMENTOS_TRANSPORTADORA`**
    *   *Gatilho:* Notas fiscais da Pontual emitidas e anexadas ao processo.
    *   *Ação Operacional:* O portal é liberado para que a Transportadora (ou o Cessionário) emita e submeta o seu **CT-e definitivo e MDF-e de transporte** com base no peso líquido real aferido na balança da Pontual.
*   **Status 7: `LIBERADO_PARA_SAIDA` / `FINALIZADO`**
    *   *Gatilho:* Documentos finais da transportadora validados sistemicamente.
    *   *Ação:* A portaria libera a distrital de saída. O ciclo é encerrado, o saldo de cota é definitivamente abatido (`CONFIRMA_RETIRADA`) e o veículo deixa a base.

---

## 3. Especificações Técnicas e Estrutura de Banco de Dados (PostgreSQL)

Para sustentar este fluxo corporativo, o banco de dados relacional deve conter as seguintes tabelas centrais:

### A) Tabela `ilhas` (Controle Industrial)
```sql
CREATE TABLE ilhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planta_id UUID NOT NULL,
    codigo VARCHAR(20) NOT NULL, -- Ex: ILHA-01
    descricao VARCHAR(100) NOT NULL,
    produtos_permitidos JSONB NOT NULL, -- Ex: ["Diesel S10", "Diesel S500"]
    vazao_media_lh NUMERIC(10,2) NOT NULL, -- Litros por hora
    status VARCHAR(30) NOT NULL, -- LIVRE, OCUPADA, EM_MANUTENCAO, BLOQUEADA
    conexao_clp_tag VARCHAR(100), -- Tag OPC-UA para intertravamento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B) Tabela `grades` (O Core Logístico com Trava por Placa)
```sql
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planta_id UUID NOT NULL,
    cessionario_id UUID REFERENCES cessionarios(id),
    transportadora_id UUID REFERENCES transportadoras(id),
    tipo_origem VARCHAR(20) NOT NULL, -- CESSIONARIO ou TRANSPORTADORA
    produto_id UUID NOT NULL,
    volume_planejado NUMERIC(12,3) NOT NULL,
    volume_efetivo NUMERIC(12,3),
    data_grade DATE NOT NULL,
    slot_id UUID NOT NULL,
    placa_cavalo VARCHAR(8) NOT NULL, -- Chave da trava por placa
    placa_carreta VARCHAR(8),
    motorista_id UUID NOT NULL,
    ilha_id UUID REFERENCES ilhas(id),
    status VARCHAR(40) NOT NULL, -- AGENDADO até FINALIZADO
    bilhete_qr_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice parcial crucial para garantir a Trava por Placa Universal
CREATE UNIQUE INDEX idx_trava_placa_ativa 
ON grades (planta_id, placa_cavalo, data_grade) 
WHERE status NOT IN ('CANCELADO', 'REPROVADO_TRIAGEM', 'LIBERADO_SAIDA', 'FINALIZADO', 'NO_SHOW');
```

### C) Tabela `cota_movimentacoes` (Auditoria de Cessionários)
```sql
CREATE TABLE cota_movimentacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contrato_item_id UUID NOT NULL,
    grade_id UUID REFERENCES grades(id),
    tipo_movimento VARCHAR(30) NOT NULL, -- RESERVA, CONFIRMA_RETIRADA, DEVOLUCAO, AJUSTE_MANUAL
    volume NUMERIC(12,3) NOT NULL,
    usuario_id UUID NOT NULL,
    motivo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. O Frontend Demo Aprimorado (`localhost:3100`)

Para refletir fielmente este masterplan, o aplicativo demo em **React + Tailwind CSS** foi totalmente reestruturado em `/root/dev202603/src/App.jsx`. Ele agora possui um fluxo guiado que demonstra exatamente:
1. **O painel do Cessionário** consultando seu saldo livre e agendando descarga/carga.
2. **A Trava por Placa Universal** rejeitando conflitos em tempo real.
3. **A Esteira de Status da Ilha** (`CHEGOU_NA_BASE` → `AGUARDANDO_CARREGAMENTO` → `EM_CARREGAMENTO` → `CARREGAMENTO_FINALIZADO` → `AGUARDANDO_FATURAMENTO` → `AGUARDANDO_DOCUMENTOS_TRANSPORTADORA` → `LIBERADO_PARA_SAIDA`).
4. **O painel do Operador de Ilha** controlando o preset e os intertravamentos CLP (OPC-UA).

O código já foi construído, testado, compilado via Vite e sincronizado no repositório do projeto.
