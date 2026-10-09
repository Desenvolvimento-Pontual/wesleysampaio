# README - Demo Interativa | Portal Pontual

Aplicação demo interativa em **React + Tailwind CSS** rodando em `localhost:3100`, demonstrando todas as especificações funcionais e a identidade visual oficial da **Pontual Brasil Petróleo Ltda**.

Organização no GitHub: **[administrativo-pontual](https://github.com/administrativo-pontual)**  
Repositório: **dev202603**

---

## 🚀 Funcionalidades da Demo

1. **Seletor de Perfis (Modo Demo no Header):**
   - **Portal Externo (B2B):** Transportadora (Agendador) e Cessionário (Gestor de Cota).
   - **Sistema Interno (Operação Base):** Dispatcher (Torre de Controle / YMS), Portaria (Totem QR Code), Fiscal (Triagem Documental) e Operador de Ilha (Preset & CLP).

2. **Motor de Agendamento & Trava por Placa Universal:**
   - Permite testar em tempo real a regra que impede o mesmo veículo de possuir duas grades ativas no mesmo dia. (Teste com a placa `ABC1D23` para visualizar o bloqueio imediato).

3. **Gestão de Cotas para Cessionários:**
   - Exibição de saldo contratual por produto (Diesel S10, Etanol, Gasolina), volume total, reservado e disponível.

4. **Torre de Controle & Sistema de Ilhas (Baias):**
   - Mapa interativo das ilhas de carregamento com status em tempo real (`LIVRE`, `OCUPADA`, `MANUTENCAO`), veículo alocado, tempo na baia, botão de `Call-Up` e verificação de intertravamentos de segurança CLP.

5. **Esteira de Triagem Documental e Portaria:**
   - Simulação de aprovação fiscal de CT-e, MDF-e, CIV/CIPP e geração de Bilhete Digital com QR Code.

---

## 🛠️ Como Executar Localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento na porta 3100
npm run dev
```

---
*Pontual Brasil Petróleo Ltda — Organização GitHub: `administrativo-pontual`*
