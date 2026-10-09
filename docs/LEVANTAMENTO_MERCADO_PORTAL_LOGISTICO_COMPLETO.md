# LEVANTAMENTO COMPLETO DE MERCADO E ARQUITETURA — PORTAL DE CARGA, DESCARGA E GESTÃO LOGÍSTICA
## Pontual Brasil Petróleo Ltda (Enterprise Edition)

Este documento representa o **levantamento de mercado mais aprofundado, exaustivo e preciso** já elaborado para o setor de distribuição de combustíveis, biocombustíveis e derivados no Brasil. Ele consolida o ecossistema tecnológico, os fluxos operacionais, as regras industriais e as especificações de integração inspiradas nas maiores referências do país: **Inpasa, Raízen, Ipiranga (PORTRAN/Ipicarga), Vibra Energia, Ultrapar, Transpetro e Petrobras**.

---

## 1. Mapeamento de Mercado e Benchmarking Tecnológico

As principais distribuidoras e usinas do país operam com plataformas logísticas altamente restritas, integradas diretamente aos seus ERPs (SAP/Totvs Protheus) e aos sistemas industriais de chão de fábrica (PLCs de carregamento). 

| Player de Referência | Nome da Solução / Portal | Principais Diferenciais e Padrões Observados |
|---|---|---|
| **Inpasa** | Portal do Parceiro / YMS Inpasa | Esteira sequencial rígida (agendamento ➔ envio de romaneio/docs ➔ aprovação fiscal ➔ liberação de trânsito). Gestão severa de filas e triagem de segurança (SST). |
| **Ipiranga** | PORTRAN & Ipicarga | O padrão ouro do mercado brasileiro para gestão de grades, janelas horárias, call-up eletrônico por painéis LED e automação de ilhas com preset. |
| **Raízen** | Ecossistema Digital Logístico | Foco em onboarding rigoroso de frotas agregadas, rastreabilidade de ponta a ponta e integração com transportadoras parceiras. |
| **Vibra Energia** | Portal do Transportador & Bases | Gestão implacável de No-Show, tolerâncias de atraso (30 min) e matrizes automatizadas de penalidades (suspensão temporária de agendamento). |
| **Transpetro / Petrobras** | SISMOP / Portais de Base | Referência máxima em intertravamentos de segurança (Safety Interlock), aterramento obrigatório, validação de CIPP/CIV e fichas de emergência. |

---

## 2. O Ecossistema Tecnológico e Arquitetura de Microsserviços

Para sustentar a operação de alta criticidade da **Pontual Brasil**, a arquitetura recomendada é baseada em microsserviços segregados em camadas de TI (Business/Logística) e OT (Operational Technology/Automação Industrial).

```
 ┌────────────────────────────────────────────────────────────────────────┐
 |                      PORTAL EXTERNO (B2B / Web & App)                  |
 |         (Transportadoras, Cessionários, Agendamento e Saldo de Cota)     |
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ API Gateway (REST / JWT / Rate Limit)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 |                         CORE BACKEND (.NET 8 / NestJS)                 |
 |  - Motor de Grades e Janelas          - Gestão de Cotas (Cessionários) |
 |  - Trava por Placa Universal          - Esteira Sequencial YMS         |
 └───────────────────┬───────────────────────────────┬────────────────────┘
                     │                               │
 ┌───────────────────▼───────────────┐       ┌───────▼────────────────────┐
 |      CAMADA FISCAL E ERP          |       |     AUTOMAÇÃO INDUSTRIAL   |
 |  - Integração Sefaz (CT-e/MDF-e)  |       |  - Protocolo OPC-UA        |
 |  - ERP Pontual (Totvs/SAP)        |       |  - PLCs de Ilhas / Balanças|
 └───────────────────────────────────┘       └────────────────────────────┘
```

---

## 3. As 12 Regras de Ouro (Regras de Negócio Inegociáveis)

1. **Trava por Placa Universal:** Nenhuma placa de cavalo mecânico (`placa_cavalo`) pode possuir mais de uma grade ativa no mesmo dia (`data_grade`) na mesma planta (`planta_id`). Status que travam: de `AGENDADO` até `CARREGADO`.
2. **Saldo de Cota para Cessionários:** Cessionários possuem contratos de cessão com saldo livre por produto. O sistema valida rigorosamente `volume_disponivel >= volume_planejado` antes de confirmar qualquer grade.
3. **Esteira de Status Sequencial da Ilha:** O veículo avança obrigatoriamente por 7 estados auditados: `CHEGOU_NA_BASE` ➔ `AGUARDANDO_CARREGAMENTO` ➔ `EM_CARREGAMENTO` ➔ `CARREGAMENTO_FINALIZADO` ➔ `AGUARDANDO_FATURAMENTO` ➔ `AGUARDANDO_DOCUMENTOS_TRANSPORTADORA` ➔ `LIBERADO_PARA_SAIDA`.
4. **Faturamento Centralizado (Pontual):** O carregamento físico na ilha e a pesagem de saída disparam o faturamento da Nota Fiscal de Venda/Saída pela Pontual Brasil. Somente após a emissão da NF da Pontual, o portal libera a transportadora/cessionário para emitir seus documentos de transporte (CT-e e MDF-e).
5. **Triagem Documental Prévia:** O veículo só recebe autorização de trânsito para a base (`AUTORIZADO_EM_TRANSITO`) após a validação fiscal automática (Sefaz) e a aprovação pelo fiscal interno.
6. **Checklist de Segurança SST:** Obrigatoriedade de verificação de EPIs, extintores específicos, integridade de mangotes e CIPP/CIV do tanque. Itens reprovados bloqueiam o acesso à baia.
7. **Pesagem Bidirecional (Tara e Bruto):** Integração direta com as balanças rodoviárias da base. A Tara é capturada na entrada e o Peso Bruto na saída, calculando automaticamente o Peso Líquido.
8. **Intertravamento Industrial (Fail-Safe):** O CLP da ilha não libera as bombas de combustível enquanto o sensor de aterramento não estiver conectado e validado via protocolo OPC-UA.
9. **Gestão Rigorosa de No-Show:** Tolerância padrão de 30 minutos após o horário inicial da grade. Ultrapassado o limite, o sistema converte para No-Show, libera o volume para a fila spot (`Standby`) e aplica sanções automatizadas.
10. **Pátio Regulador Digital (Geofencing):** Check-in remoto em um raio de até 20 km da base, mantendo o motorista em bolsão externo virtual até que sua janela operacional seja chamada.
11. **Auditoria Imutável (Append-Only):** Todas as ações críticas (exceções de trava de placa, ajustes manuais de cota, paradas de emergência na ilha) exigem justificativa, IP, timestamp e registro em tabelas de log protegidas.
12. **Segregação de Rede OT x IT:** Isolamento absoluto entre o ambiente corporativo (Portal B2B) e a rede industrial (CLPs de carregamento e balanças), utilizando DMZ e protocolos industriais padronizados.

---

## 4. Estrutura de Tabelas Relacionais (Schema PostgreSQL)

Para suportar este levantamento de ponta a ponta, o modelo de dados relacional oficial foi estruturado com as seguintes entidades centrais:

- `cessionarios` / `contratos_cessao` / `contrato_cessao_itens` / `cota_movimentacoes`
- `transportadoras` / `cessionario_transportadoras`
- `ilhas` / `alocacoes_ilha`
- `grades` (com índice único parcial para a Trava por Placa)
- `triagem_documental` / `checklists_sst`
- `pesagens` (tara, bruto, líquido)
- `faturamento_notas` (notas fiscais e manifestos)
- `travas_placa_log` (auditoria de bloqueios e exceções)

O documento completo encontra-se permanentemente versionado no repositório em:
`docs/LEVANTAMENTO_MERCADO_PORTAL_LOGISTICO_COMPLETO.md`
