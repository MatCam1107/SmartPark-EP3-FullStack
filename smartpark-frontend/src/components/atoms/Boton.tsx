interface BotonProps {
  texto: string
  onClick: () => void
}

function Boton({ texto, onClick }: BotonProps) {
  return (
    <button className="btn boton-smartpark" onClick={onClick}>
      {texto}
    </button>
  )
}

export default Boton