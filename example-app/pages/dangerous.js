const Dangerous = () => {
  return (
    <div dangerouslySetInnerHTML={{__html: '<script>console.log("GAME OVER WITH SSR");</script>'}}></div>
  )
}

export default Dangerous