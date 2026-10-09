# LEVANTAMENTO ESTRUTURAL E FUNCIONAL COMPLETO — PORTAL DE CARGA, DESCARGA E GESTÃO LOGÍSTICA
## Pontual Brasil Petróleo Ltda

Este documento consolida o levantamento mais exaustivo, profundo e detalhado para a engenharia, arquitetura e operação do Portal Logístico da **Pontual Brasil Petróleo Ltda**. Ele abrange todos os subsistemas, telas, fluxos de integração industrial, matrizes de permissão e regras de negócio para assegurar que o portal atenda a padrões corporativos de nível mundial.

---

## 1. Arquitetura Geral de Módulos (Macrofluxo)

O portal é dividido em 6 módulos principais, segregados entre o **Ambiente Externo (B2B)** e o **Ambiente Interno (Base Operacional)**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 | 1. MÓDULO B2B (Externo)                                                |
 |    - Gestão de Acesso, Contratos e Cotas                               |
 |    - Simulador de Slots e Agendamento (com Trava por Placa Universal)  |
 |    - Submissão Documental Prévia (CT-e, MDF-e, CIPP/CIV, CNH/MOPP)       |
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 | 2. MÓDULO YMS / PÁTIO (Portaria & Check-in)                            |
 |    - Pátio Regulador Digital (Geofencing / Raio de 20 km)              |
 |    - Check-in por Totem / Leitura de QR Code Dinâmico (JWT)            |
 |    - Checklist de Segurança SST (Inspeção veicular com fotos)          |
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────┬────────────────────────────────────┐
 | 3. MÓDULO DE BALANÇAS (Pesagem)   | 4. MÓDULO DE ILHAS (Chão de Fábrica)|
 |    - Captura automática de Tara   |    - Mapa em tempo real da Torre   |
 |    - Captura de Peso Bruto        |    - Intertravamento CLP (OPC-UA)  |
 |    - Cálculo de Peso Líquido      |    - Preset e Parada de Emergência |
 └───────────────────────────────────┴────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 | 5. MÓDULO DE FATURAMENTO E FISCAL (Pontual Brasil)                     |
 |    - Emissão de NF de Venda/Saída e Manifesto da Pontual               |
 |    - Liberação sistêmica para emissão de CT-e/MDF-e da transportadora  |
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 | 6. MÓDULO DE TORRE DE CONTROLE & BI (Gerencial)                        |
 |    - Dashboards de Dwell Time, Vazão Média e Ocupação de Grades        |
 |    - Auditoria imutável (travas de placa, ajustes manuais de cota)     |
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detalhamento Funcional por Tela e Papel

### Módulo 1: Portal B2B (Cessionários e Transportadoras)
*   **Tela de Login e Autenticação:** Suporte a e-mail/CNPJ, senha segura, MFA (TOTP) obrigatório para perfis privilegiados e recuperação de senha auditada.
*   **Dashboard do Cessionário (Saldo Livre):** Visão consolidada dos contratos de cessão ativos, saldo contratual por produto (Diesel S10/S500, Etanol, Gasolina), volume reservado e volume retirado.
*   **Simulador e Agendamento de Grades:** Seleção de data, planta e slot horário. Validação síncrona em tempo real:
    1. Verifica limite de crédito (se transportadora) ou saldo de cota (se cessionário).
    2. Executa a **Trava por Placa Universal** (`placa_cavalo + data + planta`). Se ativa, bloqueia e exibe modal explicativo.
*   **Central de Documentos & Triagem Prévia:** Envio digital de CT-e, MDF-e, GNRE e arquivos CIPP/CIV e ASO. Status visíveis: `PENDENTE`, `EM_ANALISE`, `APROVADO`, `REPROVADO`.

### Módulo 2: Operação de Pátio e Portaria (YMS)
*   **Check-in Remoto (Geofencing):** Aplicativo móvel do motorista detecta proximidade da base (20 km) e envia aviso de chegada, direcionando para bolsão externo virtual caso a base esteja cheia.
*   **Totem / Portaria Digital:** Leitura do QR Code dinâmico do bilhete digital. Validação biométrica ou facial opcional.
*   **Checklist SST (Inspeção Física):** Formulário guiado para verificação de extintores, válvulas, mangotes, pneus, aterramento e EPIs obrigatórios (capacete, botina, óculos, vestimenta antichama). Fotos obrigatórias para itens críticos.

### Módulo 3: Balanças e Pesagem
*   **Pesagem de Entrada (Tara):** Comunicação via driver Serial/TCP com a balança rodoviária para captura do peso do veículo vazio.
*   **Pesagem de Saída (Bruto):** Pós-carregamento, captura automática do peso cheio, cálculo do Peso Líquido e validação contra tolerâncias legais por eixo.

### Módulo 4: Esteira de Ilhas (Baias de Carregamento)
*   **Mapa de Pátio (Torre de Controle):** Grid gráfico com o status de cada baia (`LIVRE`, `OCUPADA`, `MANUTENCAO`, `BLOQUEADA`).
*   **Call-Up Eletrônico:** Disparo automático de chamada para baia via painel LED externo e push notification no app do motorista.
*   **Painel da Ilha (Preset & CLP):** Interface para o operador acompanhar o volume programado versus o volume acumulado em tempo real, monitorar a vazão (L/min) e acionar o botão de parada de emergência (*Fail-Safe*).

### Módulo 5: Faturamento e Emissão Documental
*   **Central de Faturamento (Pontual):** Recebe o evento de carregamento finalizado e pesagem de saída concluída. Emite a Nota Fiscal de Venda/Saída da Pontual Brasil e o Manifesto de Carga.
*   **Liberação Documental para Transportadora:** Altera o status da grade para `AGUARDANDO_DOCUMENTOS_TRANSPORTADORA`, permitindo que a empresa emita seu CT-e definitivo com base no peso líquido exato aferido na balança.

---

## 3. Requisitos Não Funcionais, Segurança e Compliance

- **Segurança da Informação:** Criptografia TLS 1.3 em trânsito, senhas com bcrypt (custo 12), proteção contra OWASP Top 10 e mascaramento de dados sensíveis (LGPD).
- **Segregação OT x IT:** Isolamento de rede por VLANs e Firewall, garantindo que falhas no Portal Web B2B nunca afetem os PLCs industriais e balanças da base.
- **Disponibilidade e Resiliência (99,9%):** Arquitetura em microsserviços tolerantes a falhas, com filas de mensageria (RabbitMQ / Azure Service Bus) para processamento assíncrono de notas fiscais e eventos de balança.
- **Auditoria e Logs Imutáveis:** Armazenamento de trilhas de auditoria para toda tentativa de quebra da trava por placa, ajustes manuais de cota e exceções operacionais.

---

## 4. Plano de Implementação (Fases do Projeto)

| Fase | Escopo de Entregas | Prazo Estimado |
|---|---|---|
| **Fase 1: Core B2B & Motor de Grades** | Cadastros base, autenticação RBAC, Gestão de Cotas (Cessionários) e motor de agendamento com Trava por Placa Universal. | 6 semanas |
| **Fase 2: Triagem & YMS de Pátio** | Workflow fiscal de triagem documental, check-in por QR Code, Checklist SST e balança de tara. | 4 semanas |
| **Fase 3: Automação Industrial (Ilhas)** | Integração com PLCs via OPC-UA, painel da ilha, preset de carregamento, pesagem de saída e faturamento. | 6 semanas |
| **Fase 4: BI, Torre de Controle & App** | Dashboard gerencial em tempo real, KPIs de Dwell Time e aplicativo móvel offline-first para motoristas. | 4 semanas |

---
*Pontual Brasil Petróleo Ltda — Organização GitHub: `Desenvolvimento-Pontual` / Repositório: `wesleysampaio`*
