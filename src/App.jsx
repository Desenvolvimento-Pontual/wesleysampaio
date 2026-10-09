import React, { useState } from 'react';
import { 
  Truck, ShieldAlert, FileText, Calendar, Building2, LayoutDashboard, 
  CheckCircle2, AlertTriangle, XCircle, Clock, QrCode, Lock, UserCheck, 
  MapPin, Activity, Settings, LogOut, Layers, AlertOctagon, ArrowRight,
  CheckSquare, RefreshCw, ChevronRight, Bell, ShieldCheck
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('externo-transportadora'); // 'externo-transportadora', 'externo-cessionario', 'interno-dispatcher', 'interno-portaria', 'interno-fiscal', 'interno-ilha'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [placaInput, setPlacaInput] = useState('');
  const [travaStatus, setTravaStatus] = useState(null);
  const [agendamentos, setAgendamentos] = useState([
    { id: 'GRD-9021', data: '2026-10-09', hora: '10:00 - 11:00', placa: 'ABC1D23', produto: 'Diesel S10', volume: '30.000 L', status: 'AGENDADO', tipo: 'TRANSPORTADORA' },
    { id: 'GRD-9022', data: '2026-10-09', hora: '11:00 - 12:00', placa: 'XYZ9W87', produto: 'Etanol Hidratado', volume: '25.000 L', status: 'EM_TRIAGEM', tipo: 'CESSIONARIO' },
    { id: 'GRD-9019', data: '2026-10-09', hora: '08:00 - 09:00', placa: 'DEF4G56', produto: 'Gasolina Aditivada', volume: '35.000 L', status: 'EM_CARREGAMENTO', tipo: 'TRANSPORTADORA' }
  ]);

  const [ilhas, setIlhas] = useState([
    { id: '1', codigo: 'ILHA-01', produto: 'Diesel S10', status: 'OCUPADA', veiculo: 'DEF4G56', transportadora: 'TransPetrol Ltda', inicio: '08:15', tempo: '42 min' },
    { id: '2', codigo: 'ILHA-02', produto: 'Diesel S500', status: 'LIVRE', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-' },
    { id: '3', codigo: 'ILHA-03', produto: 'Etanol Hidratado', status: 'MANUTENCAO', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-' },
    { id: '4', codigo: 'ILHA-04', produto: 'Gasolina Comum / Aditivada', status: 'LIVRE', veiculo: '-', transportadora: '-', inicio: '-', tempo: '-' },
  ]);

  const [cotasCessionario, setCotasCessionario] = useState([
    { produto: 'Diesel S10', total: 500000, reservado: 30000, retirado: 220000, disponivel: 250000 },
    { produto: 'Etanol Hidratado', total: 300000, reservado: 25000, retirado: 100000, disponivel: 175000 },
    { produto: 'Gasolina Aditivada', total: 400000, reservado: 0, retirado: 150000, disponivel: 250000 },
  ]);

  const [novaGrade, setNovaGrade] = useState({
    placa: '',
    produto: 'Diesel S10',
    volume: '30000',
    data: '2026-10-09',
    slot: '14:00 - 15:00'
  });

  const [mensagemSimulacao, setMensagemSimulacao] = useState(null);

  // Simulação da Trava por Placa
  const simularTravaPlaca = (e) => {
    e.preventDefault();
    if (!novaGrade.placa) return;
    
    const placaClean = novaGrade.placa.toUpperCase().trim();
    // Verifica se já existe na lista com status ativo
    const gradeAtiva = agendamentos.find(g => g.placa === placaClean && ['AGENDADO', 'AGUARDANDO_TRIAGEM', 'EM_TRIAGEM', 'AUTORIZADO_EM_TRANSITO', 'EM_TRANSITO', 'CHEGOU', 'EM_FILA', 'CHAMADO_PARA_BAIA', 'EM_CARREGAMENTO'].includes(g.status));

    if (gradeAtiva) {
      setMensagemSimulacao({
        tipo: 'erro',
        titulo: 'BLOQUEADO PELA TRAVA POR PLACA!',
        texto: `A placa [${placaClean}] já possui a grade ativa ${gradeAtiva.id} para hoje na base (Status: ${gradeAtiva.status}). Não é permitido agendar nova grade para o mesmo veículo no mesmo dia.`
      });
    } else {
      // Sucesso, cria nova grade
      const idNovo = `GRD-${Math.floor(1000 + Math.random() * 9000)}`;
      const item = {
        id: idNovo,
        data: novaGrade.data,
        hora: novaGrade.slot,
        placa: placaClean,
        produto: novaGrade.produto,
        volume: `${Number(novaGrade.volume).toLocaleString()} L`,
        status: 'AGENDADO',
        tipo: role.includes('cessionario') ? 'CESSIONARIO' : 'TRANSPORTADORA'
      };
      setAgendamentos([item, ...agendamentos]);
      setMensagemSimulacao({
        tipo: 'sucesso',
        titulo: 'Grade Agendada com Sucesso!',
        texto: `Agendamento ${idNovo} confirmado para a placa ${placaClean}. Volume reservado e cota/crédito validados sem duplicidade.`
      });
      setNovaGrade({ placa: '', produto: 'Diesel S10', volume: '30000', data: '2026-10-09', slot: '14:00 - 15:00' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER INSTITUCIONAL / BARRA DE PERFIS */}
      <header className="bg-slate-900 border-b border-rose-950/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-900/40 p-2 rounded-xl border border-rose-700/50 flex items-center gap-2">
              <img src="/pontual-logo.png" alt="Pontual Brasil" className="h-8 object-contain brightness-0 invert" onError={(e)=>{e.target.style.display='none'}} />
              <span className="font-bold text-lg tracking-wider text-white">PONTUAL <span className="text-rose-500 font-light">BRASIL</span></span>
            </div>
            <span className="text-xs bg-rose-950/80 text-rose-300 px-2.5 py-1 rounded-full border border-rose-800/50 uppercase font-semibold tracking-wide">
              Portal Logístico & Operacional v1.0
            </span>
          </div>

          {/* SELETOR DE PERFIS (DEMO INTERATIVA) */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium px-2">Modo Demo:</span>
            <select 
              value={role} 
              onChange={(e) => { setRole(e.target.value); setActiveTab('dashboard'); }}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:border-rose-500"
            >
              <optgroup label="Portal Externo (B2B)">
                <option value="externo-transportadora">Transportadora (Agendador)</option>
                <option value="externo-cessionario">Cessionário (Gestor de Cota)</option>
              </optgroup>
              <optgroup label="Sistema Interno (Operação Base)">
                <option value="interno-dispatcher">Dispatcher / Torre de Controle (YMS)</option>
                <option value="interno-portaria">Portaria & Totem (Check-in)</option>
                <option value="interno-fiscal">Fiscal (Triagem Documental)</option>
                <option value="interno-ilha">Operador de Ilha (Preset & CLP)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / CONTEXTO DO PERFIL */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-b border-rose-950/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Perfil ativo: <strong className="text-white uppercase tracking-wider">{role.replace('-', ' • ')}</strong></span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span>Planta: <strong>Base Primária - Paulínia/SP</strong></span>
            <span>Data Operacional: <strong>09/10/2026</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR DE NAVEGAÇÃO */}
        <aside className="w-full md:w-64 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 h-fit">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">Módulos do Sistema</div>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Principal</span>
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

              {role === 'externo-cessionario' && (
                <button 
                  onClick={() => setActiveTab('cotas')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'cotas' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Gestão de Cotas & Extrato</span>
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
                <span>Triagem & Fiscal</span>
              </button>

              <button 
                onClick={() => setActiveTab('portaria')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'portaria' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <QrCode className="w-4 h-4" />
                <span>Portaria & Check-in</span>
              </button>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 px-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-400 mb-1">Pontual Brasil Petróleo</p>
            <p>Segurança, Compliance & Automação Industrial integradas.</p>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col gap-6">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Portal Operacional, Pontual Brasil</h1>
                <p className="text-slate-400 text-sm max-w-2xl mb-6">
                  Sistema integrado para gestão de grades de carregamento, controle rígido de ilhas (baias), travamento anti-duplicidade por placa e controle de cotas para cessionários.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Grades Ativas Hoje</div>
                    <div className="text-2xl font-bold text-white">142</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 94% Dwell time normalizado
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Ilhas Operacionais</div>
                    <div className="text-2xl font-bold text-emerald-400">4 / 4</div>
                    <div className="text-xs text-slate-400 mt-1">100% com intertravamento CLP</div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Tentativas de Duplicidade Bloqueadas</div>
                    <div className="text-2xl font-bold text-rose-500">12</div>
                    <div className="text-xs text-rose-400 mt-1">Pela Trava por Placa Universal</div>
                  </div>
                </div>
              </div>

              {/* LISTA DE GRADES RECENTES */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5 text-rose-500" />
                    <span>Grades de Carregamento Ativas (Base Paulínia)</span>
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Atualizado em tempo real</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-medium">ID Grade</th>
                        <th className="pb-3 font-medium">Placa</th>
                        <th className="pb-3 font-medium">Produto</th>
                        <th className="pb-3 font-medium">Volume</th>
                        <th className="pb-3 font-medium">Janela</th>
                        <th className="pb-3 font-medium">Origem</th>
                        <th className="pb-3 font-medium">Status Atual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {agendamentos.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-800/40">
                          <td className="py-3 font-semibold text-rose-400">{g.id}</td>
                          <td className="py-3 font-mono font-bold text-white bg-slate-800/50 px-2 rounded w-fit">{g.placa}</td>
                          <td className="py-3">{g.produto}</td>
                          <td className="py-3">{g.volume}</td>
                          <td className="py-3 text-slate-300">{g.hora}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${g.tipo === 'CESSIONARIO' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-blue-950 text-blue-300 border border-blue-800'}`}>
                              {g.tipo}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
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

          {/* TAB: AGENDAMENTO E TRAVA POR PLACA */}
          {activeTab === 'agendamento' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-rose-600/20 text-rose-500 rounded-xl border border-rose-600/30">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Motor de Agendamento & Trava por Placa</h2>
                    <p className="text-sm text-slate-400">Teste em tempo real a regra que impede o mesmo veículo de segurar duas grades no mesmo dia.</p>
                  </div>
                </div>

                {mensagemSimulacao && (
                  <div className={`p-4 rounded-xl mb-6 border flex items-start gap-3 ${mensagemSimulacao.tipo === 'erro' ? 'bg-rose-950/60 border-rose-800 text-rose-200' : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'}`}>
                    {mensagemSimulacao.tipo === 'erro' ? <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                    <div>
                      <h4 className="font-bold text-sm">{mensagemSimulacao.titulo}</h4>
                      <p className="text-xs mt-1 leading-relaxed">{mensagemSimulacao.texto}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={simularTravaPlaca} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Placa do Cavalo Mecânico</label>
                    <input 
                      type="text" 
                      placeholder="Ex: ABC1D23" 
                      value={novaGrade.placa}
                      onChange={(e) => setNovaGrade({...novaGrade, placa: e.target.value})}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Dica: Tente agendar com <strong className="text-rose-400">ABC1D23</strong> (já está ativa na tabela).</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Produto Desejado</label>
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
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Volume (Litros)</label>
                    <input 
                      type="number" 
                      value={novaGrade.volume}
                      onChange={(e) => setNovaGrade({...novaGrade, volume: e.target.value})}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Janela de Horário (Slot)</label>
                    <select 
                      value={novaGrade.slot}
                      onChange={(e) => setNovaGrade({...novaGrade, slot: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="09:00 - 10:00">09:00 - 10:00</option>
                      <option value="10:00 - 11:00">10:00 - 11:00</option>
                      <option value="14:00 - 15:00">14:00 - 15:00</option>
                      <option value="16:00 - 17:00">16:00 - 17:00</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Validar Trava & Confirmar Agendamento</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: GESTÃO DE COTAS (CESSIONÁRIO) */}
          {activeTab === 'cotas' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-purple-600/25 text-purple-400 rounded-xl border border-purple-600/30">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Minha Cota Contratual (Cessionário)</h2>
                    <p className="text-sm text-slate-400">Controle automatizado de saldo contratual por produto. O agendamento consome volume em tempo real.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {cotasCessionario.map((c, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">{c.produto}</div>
                        <div className="text-2xl font-bold text-white">{(c.disponivel).toLocaleString()} L</div>
                        <div className="text-xs text-slate-400 mt-0.5">Saldo Disponível para Retirada</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
                        <span>Total: {(c.total).toLocaleString()} L</span>
                        <span className="text-amber-400">Reservado: {(c.reservado).toLocaleString()} L</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <strong>Regra de Negócio Aplicada:</strong> O sistema impede a emissão de grades caso o volume planejado ultrapasse o `volume_disponivel`. Ao confirmar a grade, o volume é imediatamente movido para `reservado` e, ao finalizar a pesagem de saída na base, é consolidado como `retirado`.
                </div>
              </div>
            </div>
          )}

          {/* TAB: TORRE DE CONTROLE & ILHAS (YMS) */}
          {activeTab === 'torre' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600/25 text-emerald-400 rounded-xl border border-emerald-600/30">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Torre de Controle — Sistema de Ilhas (Baias)</h2>
                      <p className="text-sm text-slate-400">Visão em tempo real do pátio, status físico das ilhas e intertravamentos de segurança CLP.</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800">CLP Online (OPC-UA)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ilhas.map((ilha) => (
                    <div key={ilha.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-bold text-lg text-white">{ilha.codigo}</span>
                          <span className="text-xs text-slate-400 block">{ilha.produto}</span>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          ilha.status === 'OCUPADA' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          ilha.status === 'LIVRE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ilha.status}
                        </span>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-lg text-xs space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Veículo Alocado:</span>
                          <span className="font-mono font-bold text-white">{ilha.veiculo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Transportadora:</span>
                          <span className="text-slate-300">{ilha.transportadora}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tempo na Baia:</span>
                          <span className="text-amber-400 font-semibold">{ilha.tempo}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert(`Disparando Call-Up (Chamada) para a ilha ${ilha.codigo}`)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs transition-all border border-slate-700"
                        >
                          Chamar (Call-Up)
                        </button>
                        <button 
                          onClick={() => alert(`Inspecionando intertravamentos da ${ilha.codigo}: Aterramento OK, Válvulas OK.`)}
                          className="px-3 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs transition-all border border-rose-800/60"
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
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-600/25 text-blue-400 rounded-xl border border-blue-600/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Esteira de Triagem Documental & Fiscal</h2>
                    <p className="text-sm text-slate-400">Validação prévia de CT-e, MDF-e, NF-e e CIPP/CIV antes da liberação de trânsito para a base.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="font-bold text-white text-base">Grade GRD-9022</span>
                      <span className="text-xs text-slate-400 block">Cessionário: Cia de Petróleo Alfa • Placa: XYZ9W87</span>
                    </div>
                    <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-3 py-1 rounded-full font-semibold">Aguardando Análise Fiscal</span>
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
                      <span className="text-emerald-400 block mt-1">✓ Compliance OK</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">CNH / MOPP Motorista</span>
                      <span className="font-mono text-white">Carlos Silva (MOPP OK)</span>
                      <span className="text-emerald-400 block mt-1">✓ ASO Válido</span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => alert('Documentação reprovada com notificação enviada ao cessionário.')}
                      className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 font-semibold text-xs rounded-xl border border-rose-800 transition-all"
                    >
                      Reprovar Documentos
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

          {/* TAB: PORTARIA & TOTEM */}
          {activeTab === 'portaria' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600/25 text-rose-400 rounded-xl border border-rose-600/30">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Totem de Autoatendimento & Portaria</h2>
                    <p className="text-sm text-slate-400">Leitura de QR Code, verificação de geofence e pesagem de tara na entrada da planta.</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center max-w-md mx-auto">
                  <div className="w-48 h-48 bg-white p-4 rounded-xl mx-auto mb-4 flex items-center justify-center border-4 border-rose-600">
                    <QrCode className="w-36 h-36 text-slate-950" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Aponte o Bilhete Digital para o Leitor</h3>
                  <p className="text-xs text-slate-400 mb-6">O sistema validará o token JWT assinado, a geolocalização e a trava por placa automaticamente.</p>
                  
                  <button 
                    onClick={() => alert('Check-in realizado com sucesso! Veículo liberado para Pesagem de Tara.')}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40 text-sm"
                  >
                    Simular Leitura de QR Code (Check-in)
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 mt-12 text-center text-xs text-slate-500">
        <p>Pontual Brasil Petróleo Ltda © 2026 — Todos os direitos reservados. Organização GitHub: <strong className="text-slate-400">administrativo-pontual</strong> / Repo: <strong className="text-slate-400">dev202603</strong></p>
      </footer>
    </div>
  )
}
