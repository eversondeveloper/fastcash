import React, { useState, useEffect, useRef } from 'react';
import { PlayerMusicaStyled } from './PlayerMusicaStyled';
import comSom from "/comsom.svg" 
import semSom from "/semsom.svg" 
import pauseIcon from "/pause.svg" 
import prevIcon from "/prev.svg" 
import nextIcon from "/next.svg" 

const contextoArquivosMusica = import.meta.glob('../../public/sounds/musics/*.mp3', { eager: true });

const LISTA_OPCOES_MUSICA = Object.keys(contextoArquivosMusica)
  .map(caminho => {
    const nomeArquivo = caminho.split('/').pop().replace('.mp3', '');

    
    return {
      nome: nomeArquivo.replace(/([a-z])([A-Z])/g, '$1 $2').trim(), 
      origem: contextoArquivosMusica[caminho].default || contextoArquivosMusica[caminho]
    };
  });
  console.log(contextoArquivosMusica[0])
  
const formatarTempo = (segundos) => {
  if (isNaN(segundos) || segundos < 0) return "00:00";
  const minutos = Math.floor(segundos / 60);
  const secs = Math.floor(segundos % 60);
  return `${String(minutos).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const PlayerMusica = () => {
  
  const [statusSom, setStatusSom] = useState(false); 
  const [emPausa, setEmPausa] = useState(false); 
  const [indiceMusica, setIndiceMusica] = useState(0);
  const [volume, setVolume] = useState(0.5); 
  const [listaMusicas] = useState(LISTA_OPCOES_MUSICA);
  const [tempoAtual, setTempoAtual] = useState({ atual: 0, duracao: 0 }); 

  const origemInicial = listaMusicas.length > 0 ? listaMusicas[0].origem : '';
  const referenciaAudio = useRef(new Audio(origemInicial));

  const tocarProximaMusica = () => {
    if (listaMusicas.length === 0) return; 
    setEmPausa(false); 
    const proximoIndice = (indiceMusica + 1) % listaMusicas.length;
    setIndiceMusica(proximoIndice);
  };

  const tocarMusicaAnterior = () => {
    if (listaMusicas.length === 0) return; 
    setEmPausa(false); 
    const indiceAnterior = (indiceMusica - 1 + listaMusicas.length) % listaMusicas.length;
    setIndiceMusica(indiceAnterior);
  };
  
  const tocarParar = () => {
    const audio = referenciaAudio.current;

    if (statusSom) {
      audio.pause();
      audio.currentTime = 0; 
      setStatusSom(false); 
      setEmPausa(false); 
      setTempoAtual({ atual: 0, duracao: audio.duration }); 
    } else {
      setStatusSom(true); 
      setEmPausa(false); 
    }
  };

  const pausarContinuar = () => {
    const audio = referenciaAudio.current;

    if (!statusSom) {
      return;
    }

    if (emPausa) {
      audio.play().catch(erro => console.error("Erro ao continuar a música:", erro));
      setEmPausa(false);
    } else {
      audio.pause();
      setEmPausa(true);
    }
  };

  const lidarMudancaVolume = (evento) => {
    const novoVolume = parseFloat(evento.target.value);
    setVolume(novoVolume);
    referenciaAudio.current.volume = novoVolume; 
  };

  useEffect(() => {
    const audio = referenciaAudio.current;
    
    if (listaMusicas.length === 0) {
        audio.pause();
        return;
    }
    
    const tocarAutomaticamente = statusSom && !emPausa;
    
    if (audio.src !== listaMusicas[indiceMusica].origem) {
        audio.src = listaMusicas[indiceMusica].origem;
        audio.load(); 
        if (tocarAutomaticamente) {
            audio.play().catch(erro => console.error("Erro ao tocar nova faixa:", erro));
        }
    }
    
    audio.loop = false; 

    const aoFinalizar = () => {
      tocarProximaMusica();
    };

    audio.removeEventListener('ended', tocarProximaMusica); 
    audio.addEventListener('ended', aoFinalizar);
    
    return () => {
      audio.removeEventListener('ended', aoFinalizar);
    };
  }, [indiceMusica, listaMusicas]); 

  useEffect(() => {
    const audio = referenciaAudio.current;
    
    if (listaMusicas.length === 0) {
      audio.pause();
      return;
    }

    if (statusSom && !emPausa) {
      audio.play().catch(erro => console.error("Erro ao tocar a música:", erro));
    } else if (!statusSom) {
      audio.pause();
      audio.currentTime = 0;
    } else if (emPausa) {
      audio.pause();
    }
  }, [statusSom, emPausa, listaMusicas]); 
  
  useEffect(() => {
    const audio = referenciaAudio.current;

    const aoAtualizarTempo = () => {
      setTempoAtual(prev => ({ ...prev, atual: audio.currentTime }));
    };

    const aoCarregarMetadados = () => {
      setTempoAtual(prev => ({ atual: audio.currentTime, duracao: audio.duration }));
    };

    audio.addEventListener('timeupdate', aoAtualizarTempo);
    audio.addEventListener('loadedmetadata', aoCarregarMetadados);
    
    return () => {
      audio.removeEventListener('timeupdate', aoAtualizarTempo);
      audio.removeEventListener('loadedmetadata', aoCarregarMetadados);
    };
  }, [listaMusicas, indiceMusica]); 
  
  return (
    <PlayerMusicaStyled>
      <button 
        type="button" 
        className="prev-button"
        onClick={tocarMusicaAnterior}
        title="Música Anterior"
      >
          <img src={prevIcon} alt="Música Anterior" style={{ width: '20px', height: '20px' }} />
      </button>
      
      <button 
        type="button" 
        className="tocar-parar" 
        onClick={tocarParar}
        title={statusSom ? "Parar (Resetar)" : "Tocar"}
      >
          <img src={statusSom ? semSom : comSom} alt="Tocar / Parar Geral" />
      </button>
      
      <button 
        type="button" 
        className="pausar-continuar" 
        onClick={pausarContinuar}
        title={emPausa ? "Continuar" : "Pausar"}
        disabled={!statusSom} 
      >
          <img src={emPausa ? comSom : pauseIcon} alt="Pausar / Continuar" />
      </button>

      <button 
        type="button" 
        className="next-button"
        onClick={tocarProximaMusica}
        title="Próxima Música"
      >
          <img src={nextIcon} alt="Próxima Música" style={{ width: '20px', height: '20px' }} />
      </button>
      
      <div className="current-track-info">
          <span>
            {listaMusicas.length > 0 
                ? listaMusicas[indiceMusica].nome 
                : "Nenhuma Música Encontrada"
            }
          </span>
          <div className="tempo-musica">
            {formatarTempo(tempoAtual.atual)} / {formatarTempo(tempoAtual.duracao)}
          </div>
      </div>
      
      <div className="volume-control">
          <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={lidarMudancaVolume}
              title={`Volume: ${Math.round(volume * 100)}%`}
          />
      </div>
    </PlayerMusicaStyled>
  );
};

export default PlayerMusica;