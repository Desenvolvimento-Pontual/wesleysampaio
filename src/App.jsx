import React, { useState } from 'react';
import { 
  Truck, ShieldAlert, FileText, Calendar, Building2, LayoutDashboard, 
  CheckCircle2, AlertTriangle, XCircle, Clock, QrCode, Lock, UserCheck, 
  MapPin, Activity, Settings, LogOut, Layers, ArrowRight,
  CheckSquare, RefreshCw, ChevronRight, Bell, ShieldCheck, Database, Server, Cpu
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('externo-transportadora'); 
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para simulações interativas
  const [placaBusca, setPlacaBusca] = useState('ABC1D23');
  const [resultadoTrava, setResultadoTrava] = useState(null);
  
  const [novaGrade, setNovaGrade] = useState({
    placa: 'XYZ9W87',
    produto: 'Diesel S10',
    volume: '30000',
    data: '2026-10-09',
    slot: '14:00 - 15:00',
    tipo: 'TRANSPORTADORA',
    cessionario: ''
  });
  const [mensagemAgendamento, setMensagemAgendamento] = useState(null);

  const [agendamentos, setAgendamentos] = useState([
    { id: 'GRD-9021', data: '2026-10-09', hora: '10:00 - 11:00', placa: 'ABC1D23', produto: 'Diesel S10', volume: '30.000 L', status: 'AGENDADO', tipo: 'TRANSPORTADORA', origem: 'TransPetrol Logística' },
    { id: 'GRD-9022', data: '2026-10-09', hora: '11:00 - 12:00', placa: 'DEF4G56', produto: 'Etanol Hidratado', volume: '25.000 L', status: 'EM_TRIAGEM', tipo: 'CESSIONARIO', origem: 'Cia de Petróleo Alfa (Cota Própria)' },
    { id: 'GRD-9019', data: '2026-10-09', hora: '08:00 - 09:00', placa: 'HIJ7K89', produto: 'Gasolina Aditivada', volume: '35.000 L', status: 'EM_CARREGAMENTO', tipo: 'TRANSPORTADORA', origem: 'Rota Sul Transportes' }
  ]);

  const [ilhas, setIlhas] = useState([
    { id: '1', codigo: 'ILHA-01', produto: 'Diesel S10', status: 'OCUPADA', veiculo: 'HIJ7K89', transportadora: 'Rota Sul Transportes', inicio: '08:15', tempo: '42 min', vazao: '950 L/min', intertravamento: 'OK (Aterrado)' },
    { id: '2', codigo: 'ILHA-02', produto: 'Diesel S500', status: 'LIVRE', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-', vazao: '1.000 L/min', intertravamento: 'Standby' },
    { id: '3', codigo: 'ILHA-03', produto: 'Etanol Hidratado', status: 'MANUTENCAO', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-', vazao: '0 L/min', intertravamento: 'Bloqueado (Manutenção)' },
    { id: '4', codigo: 'ILHA-04', produto: 'Gasolina Aditivada', status: 'LIVRE', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-', vazao: '900 L/min', intertravamento: 'Standby' },
  ]);

  const [cotasCessionario, setCotasCessionario] = useState([
    { produto: 'Diesel S10', total: 500000, reservado: 30000, retirado: 220000, disponivel: 250000 },
    { produto: 'Etanol Hidratado', total: 300000, reservado: 25000, retirado: 100000, disponivel: 175000 },
    { produto: 'Gasolina Aditivada', total: 400000, reservado: 0, retirado: 150000, disponivel: 250000 },
  ]);

  // Simulação da Trava por Placa
  const verificarTravaPlaca = (e) => {
    e.preventDefault();
    const placaClean = placaBusca.toUpperCase().trim();
    const gradeAtiva = agendamentos.find(g => g.placa === placaClean && ['AGENDADO', 'AGUARDANDO_TRIAGEM', 'EM_TRIAGEM', 'AUTORIZADO_EM_TRANSITO', 'EM_TRANSITO', 'CHEGOU', 'EM_FILA', 'CHAMADO_PARA_BAIA', 'EM_CARREGAMENTO'].includes(g.status));

    if (gradeAtiva) {
      setResultadoTrava({
        bloqueado: true,
        titulo: `PLACA ${placaClean} JÁ POSSUI GRADE ATIVA!`,
        detalhes: `Atenção: A placa ${placaClean} já está vinculada à grade ${gradeAtiva.id} (Status: ${gradeAtiva.status}) na base hoje. A Trava por Placa Universal bloqueou este novo agendamento.`
      });
    } else {
      setResultadoTrava({
        bloqueado: false,
        titulo: `PLACA ${placaClean} LIBERADA PARA AGENDAMENTO`,
        detalhes: `Nenhum vínculo ativo encontrado para hoje. O veículo está apto a selecionar slot.`
      });
    }
  };

  // Simular Agendamento com Trava
  const handleAgendarGrade = (e) => {
    e.preventDefault();
    const placaClean = novaGrade.placa.toUpperCase().trim();
    const conflito = agendamentos.find(g => g.placa === placaClean && ['AGENDADO', 'AGUARDANDO_TRIAGEM', 'EM_TRIAGEM', 'AUTORIZADO_EM_TRANSITO', 'EM_TRANSITO', 'CHEGOU', 'EM_FILA', 'CHAMADO_PARA_BAIA', 'EM_CARREGAMENTO'].includes(g.status));

    if (conflito) {
      setMensagemAgendamento({
        tipo: 'erro',
        texto: `Erro 409 (Conflict): A placa [${placaClean}] já possui a grade ativa ${conflito.id}. A Trava por Placa impediu duplicidade.`
      });
      return;
    }

    const novoId = `GRD-${Math.floor(1000 + Math.random() * 9000)}`;
    const novaItem = {
      id: novoId,
      data: novaGrade.data,
      hora: novaGrade.slot,
      placa: placaClean,
      produto: novaGrade.produto,
      volume: `${Number(novaGrade.volume).toLocaleString()} L`,
      status: 'AGENDADO',
      tipo: novaGrade.tipo,
      origem: novaGrade.tipo === 'CESSIONARIO' ? 'Cessionário (Cota Própria)' : 'Transportadora Credenciada'
    };

    setAgendamentos([novaItem, ...agendamentos]);
    setMensagemAgendamento({
      tipo: 'sucesso',
      texto: `Sucesso! Grade ${novoId} gerada para a placa ${placaClean}. Cota/Crédito debitados e placa travada para hoje.`
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter',sans-serif]">
      
      {/* HEADER CORPORATIVO PONTUAL */}
      <header className="bg-slate-900 border-b border-rose-950/60 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-900/40 px-3 py-1.5 rounded-xl border border-rose-700/50 flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">PONTUAL <span className="text-rose-500 font-light">BRASIL</span></span>
            </div>
            <span className="text-xs bg-rose-950 text-rose-300 px-3 py-1 rounded-full border border-rose-800/60 uppercase font-semibold tracking-wider">
              Portal Logístico & Operacional Enterprise
            </span>
          </div>

          {/* SELETOR DE PERFIS (DEMO) */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium px-2">Simular Perfil:</span>
            <select 
              value={role} 
              onChange={(e) => { setRole(e.target.value); setActiveTab('dashboard'); }}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:border-rose-500"
            >
              <optgroup label="Portal Externo (B2B)">
                <option value="externo-transportadora">Transportadora (Agendamento & Frota)</option>
                <option value="externo-cessionario">Cessionário (Gestão de Cotas & Extrato)</option>
              </optgroup>
              <optgroup label="Sistema Interno (Base)">
                <option value="interno-dispatcher">Dispatcher / Torre de Controle (YMS)</option>
                <option value="interno-portaria">Portaria & Totem (Check-in QR)</option>
                <option value="interno-fiscal">Fiscal (Triagem Documental Sefaz)</option>
                <option value="interno-ilha">Operador de Ilha (Preset & CLP)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </header>

      {/* BARRA DE CONTEXTO DO PERFIL */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-b border-rose-950/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ambiente ativo: <strong className="text-white uppercase tracking-wider">{role.replace('-', ' • ')}</strong></span>
          </div>
          <div className="text-slate-400 flex items-center gap-4">
            <span>Base Operacional: <strong>Paulínia/SP (Terminal Primário)</strong></span>
            <span>Segurança: <strong className="text-emerald-400">JWT + RBAC + OPC-UA</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* MENU LATERAL DINÂMICO */}
        <aside className="w-full md:w-64 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 h-fit shadow-lg">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">Navegação do Sistema</div>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Visão Geral / Dashboard</span>
          </button>

          {role.includes('externo') && (
            <>
              <button 
                onClick={() => setActiveTab('agendamento')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'agendamento' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Grades & Trava</span>
              </button>

              <button 
                onClick={() => setActiveTab('trava-teste')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'trava-teste' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Lock className="w-4 h-4" />
                <span>Testar Trava por Placa</span>
              </button>

              {role === 'externo-cessionario' && (
                <button 
                  onClick={() => setActiveTab('cotas')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'cotas' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Gestão de Cotas (Saldo)</span>
                </button>
              )}
            </>
          )}

          {role.includes('interno') && (
            <>
              <button 
                onClick={() => setActiveTab('torre')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'torre' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Activity className="w-4 h-4" />
                <span>Torre de Controle & Ilhas</span>
              </button>

              <button 
                onClick={() => setActiveTab('triagem')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'triagem' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <FileText className="w-4 h-4" />
                <span>Triagem Documental (Fiscal)</span>
              </button>

              <button 
                onClick={() => setActiveTab('portaria')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'portaria' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <QrCode className="w-4 h-4" />
                <span>Portaria & Totem (Check-in)</span>
              </button>

              <button 
                onClick={() => setActiveTab('ilha-operador')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'ilha-operador' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Cpu className="w-4 h-4" />
                <span>Painel da Ilha (Preset CLP)</span>
              </button>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 px-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-400 mb-1">Pontual Brasil Petróleo</p>
            <p className="leading-relaxed">Frontend 100% interativo com regras de negócio e identidade visual aplicada.</p>
          </div>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 flex flex-col gap-6">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <h1 className="text-2xl font-extrabold text-white mb-2">Painel Operacional — Pontual Brasil</h1>
                <p className="text-slate-400 text-sm max-w-2xl mb-6 leading-relaxed">
                  Ecossistema digital integrado para controle de grades, pátio (YMS), automação industrial de ilhas, compliance de frotas e gestão de cotas para cessionários.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Grades Agendadas Hoje</div>
                    <div className="text-2xl font-bold text-white">142</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 98% dentro do SLA
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Ilhas Operacionais</div>
                    <div className="text-2xl font-bold text-emerald-400">3 / 4</div>
                    <div className="text-xs text-slate-400 mt-1">1 em manutenção programada</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Bloqueios por Trava de Placa</div>
                    <div className="text-2xl font-bold text-rose-500">14</div>
                    <div className="text-xs text-rose-400 mt-1">Duplicidade evitada hoje</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Dwell Time Médio</div>
                    <div className="text-2xl font-bold text-blue-400">72 min</div>
                    <div className="text-xs text-blue-300 mt-1">Portaria até Saída Bruto</div>
                  </div>
                </div>
              </div>

              {/* LISTA DE GRADES */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5 text-rose-500" />
                    <span>Grades de Carregamento Ativas</span>
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">Terminal Paulínia - SP</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="pb-3 font-medium">ID Grade</th>
                        <th className="pb-3 font-medium">Placa Cavalo</th>
                        <th className="pb-3 font-medium">Produto</th>
                        <th className="pb-3 font-medium">Volume</th>
                        <th className="pb-3 font-medium">Janela</th>
                        <th className="pb-3 font-medium">Tipo Origem</th>
                        <th className="pb-3 font-medium">Status Atual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {agendamentos.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 font-bold text-rose-400">{g.id}</td>
                          <td className="py-3.5 font-mono font-bold text-white bg-slate-800/60 px-2 py-1 rounded w-fit">{g.placa}</td>
                          <td className="py-3.5">{g.produto}</td>
                          <td className="py-3.5 font-medium">{g.volume}</td>
                          <td className="py-3.5 text-slate-300">{g.hora}</td>
                          <td className="py-3.5">
                            <span className={`text-xs px-2.5 py-1 rounded font-semibold ${g.tipo === 'CESSIONARIO' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-blue-950 text-blue-300 border border-blue-800'}`}>
                              {g.tipo}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                              {g.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AGENDAMENTO DE GRADES */}
          {activeTab === 'agendamento' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600/20 text-rose-500 rounded-xl border border-rose-600/30">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Criar Agendamento de Grade (B2B)</h2>
                    <p className="text-sm text-slate-400">O sistema validará automaticamente o saldo de cota (cessionário) ou crédito e aplicará a **Trava por Placa**.</p>
                  </div>
                </div>

                {mensagemAgendamento && (
                  <div className={`p-4 rounded-xl mb-6 border flex items-start gap-3 ${mensagemAgendamento.tipo === 'erro' ? 'bg-rose-950/80 border-rose-800 text-rose-200' : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'}`}>
                    {mensagemAgendamento.tipo === 'erro' ? <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                    <div>
                      <h4 className="font-bold text-sm">Retorno do Motor de Regras</h4>
                      <p className="text-xs mt-1 leading-relaxed">{mensagemAgendamento.texto}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAgendarGrade} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Placa do Cavalo Mecânico</label>
                    <input 
                      type="text" 
                      value={novaGrade.placa}
                      onChange={(e) => setNovaGrade({...novaGrade, placa: e.target.value})}
                      required
                      placeholder="Ex: ABC1D23"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Aviso: Tente digitar <strong className="text-rose-400">ABC1D23</strong> para testar a rejeição imediata por placa já ativa.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Origem da Carga</label>
                    <select 
                      value={novaGrade.tipo}
                      onChange={(e) => setNovaGrade({...novaGrade, tipo: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="TRANSPORTADORA">Transportadora (Crédito)</option>
                      <option value="CESSIONARIO">Cessionário (Consumo de Cota)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Produto</label>
                    <select 
                      value={novaGrade.produto}
                      onChange={(e) => setNovaGrade({...novaGrade, produto: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Diesel S10">Diesel S10</option>
                      <option value="Diesel S500">Diesel S500</option>
                      <option value="Etanol Hidratado">Etanol Hidratado</option>
                      <option value="Gasolina Aditivada">Gasolina Aditivada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Volume Planejado (Litros)</label>
                    <input 
                      type="number" 
                      value={novaGrade.volume}
                      onChange={(e) => setNovaGrade({...novaGrade, volume: e.target.value})}
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
                      <span>Validar Trava & Confirmar Agendamento</span>
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
                    <h2 className="text-xl font-bold text-white">Validador Instantâneo da Trava por Placa</h2>
                    <p className="text-sm text-slate-400">Consulte diretamente a API para verificar se um veículo está apto a carregar na base hoje.</p>
                  </div>
                </div>

                <form onSubmit={verificarTravaPlaca} className="flex gap-3 mb-6">
                  <input 
                    type="text" 
                    value={placaBusca}
                    onChange={(e) => setPlacaBusca(e.target.value)}
                    placeholder="Digite a placa (ex: ABC1D23)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-rose-500 text-base"
                  />
                  <button 
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40 text-sm shrink-0"
                  >
                    Consultar Trava
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

          {/* TAB: GESTÃO DE COTAS */}
          {activeTab === 'cotas' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-purple-600/25 text-purple-400 rounded-xl border border-purple-600/30">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Extrato de Cotas Contratuais (Cessionário)</h2>
                    <p className="text-sm text-slate-400">Monitoramento em tempo real do volume disponível, reservado e retirado por produto.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {cotasCessionario.map((c, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-inner">
                      <div>
                        <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">{c.produto}</div>
                        <div className="text-2xl font-extrabold text-white">{(c.disponivel).toLocaleString()} L</div>
                        <div className="text-xs text-slate-400 mt-0.5">Saldo Disponível</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
                        <span>Total: {(c.total).toLocaleString()} L</span>
                        <span className="text-amber-400 font-medium">Reservado: {(c.reservado).toLocaleString()} L</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <h2 className="text-xl font-bold text-white">Torre de Controle — Sistema de Ilhas (YMS)</h2>
                      <p className="text-sm text-slate-400">Monitoramento físico das baias de carregamento e automação industrial OPC-UA / CLP.</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 font-semibold">CLP Sincronizado</span>
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
                          onClick={() => alert(`Call-Up (Chamada) enviado para o motorista da ${ilha.codigo}`)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs transition-all border border-slate-700"
                        >
                          Chamar (Call-Up)
                        </button>
                        <button 
                          onClick={() => alert(`Status OPC-UA da ${ilha.codigo}: Todos os sensores de aterramento e pressão validados com sucesso.`)}
                          className="px-3 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 rounded-lg text-xs transition-all border border-rose-800/80"
                        >
                          Safety CLP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TRIAGEM FISCAL */}
          {activeTab === 'triagem' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-600/25 text-blue-400 rounded-xl border border-blue-600/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Triagem Documental & Fiscal (Sefaz)</h2>
                    <p className="text-sm text-slate-400">Validação prévia obrigatória de CT-e, MDF-e, NF-e e CIPP antes da liberação de trânsito.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="font-bold text-white text-base">Grade GRD-9022</span>
                      <span className="text-xs text-slate-400 block">Cessionário: Cia de Petróleo Alfa • Placa: DEF4G56</span>
                    </div>
                    <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-3 py-1 rounded-full font-semibold">Pendente Análise Fiscal</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Chave CT-e</span>
                      <span className="font-mono text-white">352610...4901</span>
                      <span className="text-emerald-400 block mt-1">✓ Sefaz Autorizada</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">CIPP / CIV do Tanque</span>
                      <span className="font-mono text-white">Válido até 12/2026</span>
                      <span className="text-emerald-400 block mt-1">✓ Vistoria OK</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Motorista & MOPP</span>
                      <span className="font-mono text-white">Carlos Silva (MOPP OK)</span>
                      <span className="text-emerald-400 block mt-1">✓ ASO Válido</span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => alert('Documentação reprovada. Notificação enviada ao parceiro.')}
                      className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 font-semibold text-xs rounded-xl border border-rose-800 transition-all"
                    >
                      Reprovar
                    </button>
                    <button 
                      onClick={() => alert('Documentação APROVADA com sucesso! Bilhete Digital QR gerado.')}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/40 transition-all"
                    >
                      Aprovar & Gerar Bilhete Digital
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PORTARIA */}
          {activeTab === 'portaria' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600/25 text-rose-400 rounded-xl border border-rose-600/30">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Totem de Autoatendimento & Portaria</h2>
                    <p className="text-sm text-slate-400">Validação de bilhete digital, geofence e pesagem de tara na entrada da base.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center max-w-md mx-auto">
                  <div className="w-48 h-48 bg-white p-4 rounded-xl mx-auto mb-4 flex items-center justify-center border-4 border-rose-600 shadow-xl">
                    <QrCode className="w-36 h-36 text-slate-950" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Aponte o Bilhete Digital para o Leitor</h3>
                  <p className="text-xs text-slate-400 mb-6">O sistema validará o token JWT assinado, a geolocalização e a trava por placa automaticamente.</p>
                  
                  <button 
                    onClick={() => alert('Check-in realizado com sucesso! Veículo direcionado para Pesagem de Tara.')}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40 text-sm"
                  >
                    Simular Leitura de QR Code (Check-in)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAINEL DA ILHA (PRESET CLP) */}
          {activeTab === 'ilha-operador' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600/25 text-rose-400 rounded-xl border border-rose-600/30">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Painel da Ilha — Automação & Preset (CLP)</h2>
                    <p className="text-sm text-slate-400">Controle do braço de carregamento, intertravamentos de segurança e monitoramento de vazão em tempo real.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                    <h3 className="font-bold text-white mb-3 text-sm flex items-center justify-between">
                      <span>Status do Carregamento (ILHA-01)</span>
                      <span className="text-emerald-400 text-xs">Em Operação</span>
                    </h3>
                    <div className="space-y-3 text-xs mb-6">
                      <div className="flex justify-between bg-slate-900 p-2.5 rounded">
                        <span className="text-slate-400">Volume Programado (Preset):</span>
                        <span className="font-bold text-white">30.000 L</span>
                      </div>
                      <div className="flex justify-between bg-slate-900 p-2.5 rounded">
                        <span className="text-slate-400">Volume Acumulado:</span>
                        <span className="font-bold text-emerald-400">14.850 L</span>
                      </div>
                      <div className="flex justify-between bg-slate-900 p-2.5 rounded">
                        <span className="text-slate-400">Vazão Instantânea:</span>
                        <span className="font-bold text-blue-400">950 L/min</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert('Parada de emergência acionada! Válvulas fechadas imediatamente pelo CLP.')}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40 text-xs tracking-wider uppercase"
                    >
                      Parada de Emergência (Fail-Safe)
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white mb-3 text-sm">Intertravamentos de Segurança (Safety)</h3>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded border border-emerald-900/40">
                          <span className="text-slate-300">Sensor de Aterramento</span>
                          <span className="text-emerald-400 font-bold">CONECTADO</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded border border-emerald-900/40">
                          <span className="text-slate-300">Válvula de Fundo do Tanque</span>
                          <span className="text-emerald-400 font-bold">ABERTA</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded border border-emerald-900/40">
                          <span className="text-slate-300">Mangote e Braço</span>
                          <span className="text-emerald-400 font-bold">TRAVADOS</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500 text-center">
                      O CLP impede o fluxo de combustível caso qualquer sensor falhe.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 mt-12 text-center text-xs text-slate-500">
        <p>Pontual Brasil Petróleo Ltda © 2026 — Todos os direitos reservados. Organização GitHub: <strong className="text-slate-400">Desenvolvimento-Pontual</strong> / Repo: <strong className="text-slate-400">wesleysampaio</strong></p>
      </footer>
    </div>
  )
}
