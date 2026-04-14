import "./OpaqueBoxTest.css";

/**
 * Painel de teste usando `.glass-surface`: blur real se o navegador suportar,
 * senão gradiente opaco que imita vidro fosco.
 */
const OpaqueBoxTest: React.FC = () => {
  return (
    <div className="opaque-box-test glass-surface">
      <p className="opaque-box-test__hint">
        Classe <code>glass-surface</code>: com <code>backdrop-filter</code> vês o fundo
        borrado; sem suporte (ou com “reduzir transparência” do SO) fica o cartão em
        gradiente sólido, sempre legível.
      </p>
    </div>
  );
};

export default OpaqueBoxTest;
