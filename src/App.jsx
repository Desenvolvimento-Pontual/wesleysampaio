import React, { useState } from 'react';
import { 
  Truck, ShieldAlert, FileText, Calendar, Building2, LayoutDashboard, 
  CheckCircle2, AlertTriangle, XCircle, Clock, QrCode, Lock, UserCheck, 
  MapPin, Activity, Settings, LogOut, Layers, ArrowRight,
  CheckSquare, RefreshCw, ChevronRight, Bell, ShieldCheck, Database, Server, Cpu, DollarSign
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('externo-cessionario'); // 'externo-cessionario', 'externo-transportadora', 'interno-dispatcher', 'interno-portaria', 'interno-fiscal', 'interno-ilha', 'interno-faturamento'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados de simulação
  const [placaBusca, setPlacaBusca] = useState('ABC1D23');
  const [resultadoTrava, setResultadoTrava] = useState(null);
  
  const [cotasCessionario, setCotasCessionario] = useState([
    { produto: 'Diesel S10', total: 500000, reservado: 30000, retirado: 220000, disponivel: 250000 },
    { produto: 'Etanol Hidratado', total: 300000, reservado: 25000, retirado: 100000, disponivel: 175000 },
    { produto: 'Gasolina Aditivada', total: 400000, reservado: 0, retirado: 150000, disponivel: 250000 },
  ]);

  const [agendamentos, setAgendamentos] = useState([
    { 
      id: 'GRD-9022', 
      data: '2026-10-09', 
      hora: '11:00 - 12:00', 
      placa: 'XYZ9W87', 
      produto: 'Diesel S10', 
      volume: '30.000 L', 
      status: 'CHEGOU_NA_BASE', 
      tipo: 'CESSIONARIO', 
      cessionario: 'Cia de Petróleo Alfa',
      transportadora: 'TransPetrol Logística',
      etapas: {
        chegada: '08:30',
        carregamento: '09:15',
        faturamento: '-',
        liberacaoTransp: '-'
      }
    },
    { 
      id: 'GRD-9019', 
      data: '2026-10-09', 
      hora: '08:00 - 09:00', 
      placa: 'DEF4G56', 
      produto: 'Gasolina Aditivada', 
      volume: '35.000 L', 
      status: 'AGUARDANDO_DOCUMENTOS_TRANSPORTADORA', 
      tipo: 'TRANSPORTADORA', 
      cessionario: 'Postos Rede Sul',
      transportadora: 'Rota Sul Transportes',
      etapas: {
        chegada: '07:10',
        carregamento: '08:00',
        faturamento: '09:00 (NF Pontual #4492)',
        liberacaoTransp: 'Aguardando CT-e definitivo'
      }
    }
  ]);

  const [ilhas, setIlhas] = useState([
    { id: '1', codigo: 'ILHA-01', produto: 'Diesel S10', status: 'OCUPADA', veiculo: 'XYZ9W87', transportadora: 'TransPetrol Logística', inicio: '09:15', tempo: '18 min', vazao: '950 L/min', intertravamento: 'OK (Aterrado)' },
    { id: '2', codigo: 'ILHA-02', produto: 'Diesel S500', status: 'LIVRE', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-', vazao: '1.000 L/min', intertravamento: 'Standby' },
    { id: '3', codigo: 'ILHA-03', produto: 'Etanol Hidratado', status: 'MANUTENCAO', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-', vazao: '0 L/min', intertravamento: 'Bloqueado (Manutenção)' },
    { id: '4', codigo: 'ILHA-04', produto: 'Gasolina Aditivada', status: 'LIVRE', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-', vazao: '900 L/min', intertravamento: 'Standby' },
  ]);

  const [novaGrade, setNovaGrade] = useState({
    placa: 'BPR8J90',
    produto: 'Diesel S10',
    volume: '30000',
    data: '2026-10-09',
    slot: '14:00 - 15:00',
    transportadoraAutorizada: 'TransPetrol'
  });
  const [mensagemAgendamento, setMensagemAgendamento] = useState(null);

  // Validador Trava por Placa
  const verificarTravaPlaca = (e) => {
    e.preventDefault();
    const placaClean = placaBusca.toUpperCase().trim();
    const gradeAtiva = agendamentos.find(g => g.placa === placaClean && g.status !== 'LIBERADO_PARA_SAIDA' && g.status !== 'FINALIZADO');

    if (gradeAtiva) {
      setResultadoTrava({
        bloqueado: true,
        titulo: `PLACA ${placaClean} BLOQUEADA PELA TRAVA UNIVERSAL!`,
        detalhes: `A placa ${placaClean} já possui a grade ativa ${gradeAtiva.id} na base hoje (Status atual: ${gradeAtiva.status}). A Trava por Placa impediu novo agendamento duplicado.`
      });
    } else {
      setResultadoTrava({
        bloqueado: false,
        titulo: `PLACA ${placaClean} LIVRE PARA AGENDAMENTO`,
        detalhes: `Nenhum vínculo ativo encontrado. O veículo pode utilizar o saldo de cota disponível.`
      });
    }
  };

  // Agendar com Consumo de Saldo de Cota + Trava por Placa
  const handleAgendarComSaldo = (e) => {
    e.preventDefault();
    const placaClean = novaGrade.placa.toUpperCase().trim();
    const conflito = agendamentos.find(g => g.placa === placaClean && g.status !== 'LIBERADO_PARA_SAIDA' && g.status !== 'FINALIZADO');

    if (conflito) {
      setMensagemAgendamento({
        tipo: 'erro',
        texto: `Rejeitado (Erro 409): A placa [${placaClean}] já está em operação na grade ${conflito.id}. A Trava por Placa Universal bloqueou a operação.`
      });
      return;
    }

    const novoId = `GRD-${Math.floor(1000 + Math.random() * 9000)}`;
    const novoItem = {
      id: novoId,
      data: novaGrade.data,
      hora: novaGrade.slot,
      placa: placaClean,
      produto: novaGrade.produto,
      volume: `${Number(novaGrade.volume).toLocaleString()} L`,
      status: 'AGENDADO',
      tipo: 'CESSIONARIO',
      cessionario: 'Cia de Petróleo Alfa',
      transportadora: novaGrade.transportadoraAutorizada,
      etapas: { chegada: '-', carregamento: '-', faturamento: '-', liberacaoTransp: '-' }
    };

    setAgendamentos([novoItem, ...agendamentos]);
    setMensagemAgendamento({
      tipo: 'sucesso',
      texto: `Sucesso! Saldo de cota debitado e grade ${novoId} gerada para a placa ${placaClean}. Placa travada para o dia.`
    });
  };

  // Avançar Status da Esteira de Ilha
  const avancarStatusGrade = (id, novoStatus) => {
    setAgendamentos(agendamentos.map(g => {
      if (g.id === id) {
        return { ...g, status: novoStatus };
      }
      return g;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter',sans-serif]">
      
      {/* HEADER CORPORATIVO PONTUAL */}
      <header className="bg-slate-900 border-b border-rose-950/60 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-900/40 px-3 py-1.5 rounded-xl border border-rose-700/50 flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">PONTUAL <span className="text-rose-500 font-light">BRASIL</span></span>
            </div>
            <span className="text-xs bg-rose-950 text-rose-300 px-3 py-1 rounded-full border border-rose-800/60 uppercase font-semibold tracking-wider">
              Portal Logístico • Masterplan Cessionários & Ilhas
            </span>
          </div>

          {/* SELETOR DE PERFIS */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium px-2">Simular Perfil:</span>
            <select 
              value={role} 
              onChange={(e) => { setRole(e.target.value); setActiveTab('dashboard'); }}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:border-rose-500"
            >
              <optgroup label="Portal Externo (B2B)">
                <option value="externo-cessionario">Cessionário (Gestão de Saldo de Cota & Agendamento)</option>
                <option value="externo-transportadora">Transportadora (Agendamento & Frotas)</option>
              </optgroup>
              <optgroup label="Sistema Interno (Base)">
                <option value="interno-dispatcher">Dispatcher / Torre de Controle (YMS & Ilhas)</option>
                <option value="interno-faturamento">Faturamento & Fiscal (Emissão NF Pontual)</option>
                <option value="interno-ilha">Operador de Ilha (Preset CLP)</option>
                <option value="interno-portaria">Portaria & Totem (Check-in QR)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </header>

      {/* SUB-HEADER CONTEXTO */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-b border-rose-950/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Perfil ativo: <strong className="text-white uppercase tracking-wider">{role.replace('-', ' • ')}</strong></span>
          </div>
          <div className="text-slate-400 flex items-center gap-4">
            <span>Base: <strong>Terminal Paulínia/SP</strong></span>
            <span>Governança: <strong className="text-emerald-400">Cota Cessionária + Faturamento Pontual + Trava Placa</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* MENU LATERAL */}
        <aside className="w-full md:w-64 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 h-fit shadow-lg">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">Módulos Masterplan</div>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard da Operação</span>
          </button>

          {role.includes('cessionario') && (
            <>
              <button 
                onClick={() => setActiveTab('cotas')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'cotas' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Layers className="w-4 h-4" />
                <span>Meu Saldo Livre (Cota)</span>
              </button>

              <button 
                onClick={() => setActiveTab('agendamento-cessionario')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'agendamento-cessionario' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar com Saldo de Cota</span>
              </button>
            </>
          )}

          <button 
            onClick={() => setActiveTab('trava-teste')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'trava-teste' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
          >
            <Lock className="w-4 h-4" />
            <span>Testar Trava por Placa</span>
          </button>

          {role.includes('interno') && (
            <>
              <button 
                onClick={() => setActiveTab('torre')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'torre' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Activity className="w-4 h-4" />
                <span>Torre de Controle (Esteira Ilhas)</span>
              </button>

              <button 
                onClick={() => setActiveTab('faturamento')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'faturamento' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Faturamento & Notas Pontual</span>
              </button>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 px-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-400 mb-1">Pontual Brasil Petróleo</p>
            <p className="leading-relaxed">Governança completa de Cessionários, Faturamento e Esteira de Ilhas.</p>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col gap-6">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <h1 className="text-2xl font-extrabold text-white mb-2">Painel Geral — Esteira Industrial e Cessionários</h1>
                <p className="text-slate-400 text-sm max-w-2xl mb-6 leading-relaxed">
                  Acompanhe em tempo real o ciclo completo: Liberação de saldo para cessionários, agendamento com trava por placa, entrada na base, carregamento na ilha sob controle CLP, faturamento e liberação documental.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Carga em Andamento na Ilha</div>
                    <div className="text-2xl font-bold text-emerald-400">2 Veículos</div>
                    <div className="text-xs text-slate-300 mt-1">Ilha 01 e Ilha 04 ativas</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Aguardando Faturamento</div>
                    <div className="text-2xl font-bold text-amber-400">3 Cargas</div>
                    <div className="text-xs text-slate-300 mt-1">Pesagem de saída concluída</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Trava por Placa (Bloqueios)</div>
                    <div className="text-2xl font-bold text-rose-500">18 Tentativas</div>
                    <div className="text-xs text-rose-300 mt-1">Duplicidade evitada no dia</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Saldo Cessionário Alfa</div>
                    <div className="text-2xl font-bold text-purple-400">250.000 L</div>
                    <div className="text-xs text-purple-300 mt-1">Diesel S10 Disponível</div>
                  </div>
                </div>
              </div>

              {/* LISTA DE GRADES COM ESTEIRA DETALHADA */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5 text-rose-500" />
                    <span>Esteira Sequencial de Carga & Descarga (Real-Time)</span>
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Terminal Paulínia</span>
                </div>

                <div className="space-y-4">
                  {agendamentos.map((g) => (
                    <div key={g.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-rose-400">{g.id}</span>
                          <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-xs">{g.placa}</span>
                          <span className="text-xs text-slate-400">• {g.produto} ({g.volume})</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Cessionário: <strong className="text-purple-300">{g.cessionario}</strong> | Transportadora: <strong className="text-slate-300">{g.transportadora}</strong>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded-full font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                          Status: {g.status}
                        </span>

                        {role === 'interno-dispatcher' && (
                          <div className="flex gap-1 text-xs">
                            <button onClick={() => avancarStatusGrade(g.id, 'AGUARDANDO_CARREGAMENTO')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700">P/ Carregamento</button>
                            <button onClick={() => avancarStatusGrade(g.id, 'AGUARDANDO_FATURAMENTO')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700">P/ Faturamento</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEU SALDO LIVRE (CESSIONÁRIO) */}
          {activeTab === 'cotas' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-purple-600/25 text-purple-400 rounded-xl border border-purple-600/30">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Saldo Livre de Contrato (Cessionário)</h2>
                    <p className="text-sm text-slate-400">A Pontual libera o saldo contratual e você utiliza para agendar suas retiradas na base.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {cotasCessionario.map((c, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-inner">
                      <div>
                        <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">{c.produto}</div>
                        <div className="text-2xl font-extrabold text-white">{(c.disponivel).toLocaleString()} L</div>
                        <div className="text-xs text-slate-400 mt-0.5">Saldo Livre para Agendamento</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
                        <span>Total Contratado: {(c.total).toLocaleString()} L</span>
                        <span className="text-amber-400 font-medium">Reservado: {(c.reservado).toLocaleString()} L</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <strong>Regra Masterplan:</strong> O saldo de descarga/carga é gernostado pela Pontual. Ao realizar o agendamento, o volume é deduzido do saldo livre e travado para a placa do caminhão indicado.
                </div>
              </div>
            </div>
          )}

          {/* TAB: AGENDAR COM SALDO DE COTA */}
          {activeTab === 'agendamento-cessionario' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600/25 text-rose-500 rounded-xl border border-rose-600/30">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Agendar Retirada Usando Saldo Livre</h2>
                    <p className="text-sm text-slate-400">Selecione o produto, informe a placa e o sistema aplicará a Trava por Placa e o consumo de cota.</p>
                  </div>
                </div>

                {mensagemAgendamento && (
                  <div className={`p-4 rounded-xl mb-6 border flex items-start gap-3 ${mensagemAgendamento.tipo === 'erro' ? 'bg-rose-950/80 border-rose-800 text-rose-200' : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'}`}>
                    {mensagemAgendamento.tipo === 'erro' ? <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                    <div>
                      <h4 className="font-bold text-sm">Retorno do Validador</h4>
                      <p className="text-xs mt-1 leading-relaxed">{mensagemAgendamento.texto}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAgendarComSaldo} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Placa do Cavalo Mecânico</label>
                    <input 
                      type="text" 
                      value={novaGrade.placa}
                      onChange={(e) => setNovaGrade({...novaGrade, placa: e.target.value})}
                      required
                      placeholder="Ex: XYZ9W87"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Dica: Teste com <strong className="text-rose-400">XYZ9W87</strong> para ver a Trava por Placa atuando.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Produto (Saldo Livre)</label>
                    <select 
                      value={novaGrade.produto}
                      onChange={(e) => setNovaGrade({...novaGrade, produto: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Diesel S10">Diesel S10 (Saldo: 250.000 L)</option>
                      <option value="Etanol Hidratado">Etanol Hidratado (Saldo: 175.000 L)</option>
                      <option value="Gasolina Aditivada">Gasolina Aditivada (Saldo: 250.000 L)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Volume Desejado (Litros)</label>
                    <input 
                      type="number" 
                      value={novaGrade.volume}
                      onChange={(e) => setNovaGrade({...novaGrade, volume: e.target.value})}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Transportadora Credenciada</label>
                    <input 
                      type="text" 
                      value={novaGrade.transportadoraAutorizada}
                      onChange={(e) => setNovaGrade({...novaGrade, transportadoraAutorizada: e.target.value})}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 text-sm"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Consumir Saldo & Agendar Grade</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: TESTAR TRAVA POR PLACA */}
          {activeTab === 'trava-teste' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600/25 text-rose-500 rounded-xl border border-rose-600/30">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Validador da Trava por Placa Universal</h2>
                    <p className="text-sm text-slate-400">Verifique se o veículo possui grade ativa no dia na mesma planta.</p>
                  </div>
                </div>

                <form onSubmit={verificarTravaPlaca} className="flex gap-3 mb-6">
                  <input 
                    type="text" 
                    value={placaBusca}
                    onChange={(e) => setPlacaBusca(e.target.value)}
                    placeholder="Digite a placa (ex: XYZ9W87)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-rose-500 text-base"
                  />
                  <button 
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40 text-sm shrink-0"
                  >
                    Consultar Placa
                  </button>
                </form>

                {resultadoTrava && (
                  <div className={`p-5 rounded-xl border flex items-start gap-4 ${resultadoTrava.bloqueado ? 'bg-rose-950/80 border-rose-800 text-rose-200' : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'}`}>
                    {resultadoTrava.bloqueado ? <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />}
                    <div>
                      <h4 className="font-bold text-base mb-1">{resultadoTrava.titulo}</h4>
                      <p className="text-xs leading-relaxed text-slate-300">{resultadoTrava.detalhes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: TORRE DE CONTROLE & ILHAS */}
          {activeTab === 'torre' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600/25 text-emerald-400 rounded-xl border border-emerald-600/30">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Torre de Controle (Esteira de Ilhas)</h2>
                      <p className="text-sm text-slate-400">Controle físico da baia até o momento em que a carga é finalizada e enviada para o faturamento.</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 font-semibold">YMS Ativo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ilhas.map((ilha) => (
                    <div key={ilha.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-extrabold text-lg text-white">{ilha.codigo}</span>
                          <span className="text-xs text-slate-400 block">{ilha.produto}</span>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                          ilha.status === 'OCUPADA' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          ilha.status === 'LIVRE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ilha.status}
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-3 rounded-lg text-xs space-y-1.5 mb-4 border border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Veículo Alocado:</span>
                          <span className="font-mono font-bold text-white">{ilha.veiculo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Transportadora:</span>
                          <span className="text-slate-300">{ilha.transportadora}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Vazão Média:</span>
                          <span className="text-emerald-400 font-semibold">{ilha.vazao}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Intertravamento (CLP):</span>
                          <span className="text-blue-400 font-semibold">{ilha.intertravamento}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert(`Call-Up acionado para a ${ilha.codigo}`)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs transition-all border border-slate-700"
                        >
                          Chamar (Call-Up)
                        </button>
                        <button 
                          onClick={() => alert(`Carga finalizada na ${ilha.codigo}. Encaminhado para pesagem de saída e faturamento.`)}
                          className="px-3 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg text-xs transition-all border border-emerald-800"
                        >
                          Finalizar Carga
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FATURAMENTO & NOTAS PONTUAL */}
          {activeTab === 'faturamento' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-amber-600/25 text-amber-400 rounded-xl border border-amber-600/30">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Faturamento & Emissão de Documentos Fiscais (Pontual)</h2>
                    <p className="text-sm text-slate-400">Após o carregamento finalizado na ilha e pesagem de saída, a Pontual fatura a NF e libera o portal para o cliente emitir o CT-e.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-bold text-white text-base">Grade GRD-9019 (DEF4G56)</span>
                      <span className="text-xs text-slate-400 block">Peso Líquido aferido na balança: <strong>34.920 kg</strong></span>
                    </div>
                    <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-semibold">Carregamento Concluído</span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">NF de Venda Pontual Emitida:</span>
                      <span className="font-mono text-emerald-400 font-bold">NF-e #4492 (Sefaz Autorizada)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Manifesto de Carga (MDF-e Pontual):</span>
                      <span className="font-mono text-white">MDF-e #11842</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Próxima Etapa:</span>
                      <span className="text-amber-400 font-semibold">Liberado para a Transportadora emitir CT-e definitivo</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={() => alert('Documentação da Pontual emitida e portal liberado para o emitente emitir CT-e/MDF-e de transporte.')}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-rose-900/40"
                    >
                      Liberar Documentos para Transportadora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 mt-12 text-center text-xs text-slate-500">
        <p>Pontual Brasil Petróleo Ltda © 2026 — Masterplan Operacional & Faturamento. Organização GitHub: <strong className="text-slate-400">Desenvolvimento-Pontual</strong> / Repo: <strong className="text-slate-400">wesleysampaio</strong></p>
      </footer>
    </div>
  )
}
