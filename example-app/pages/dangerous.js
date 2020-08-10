const Dangerous = ({ payload }) => {
  return <div dangerouslySetInnerHTML={{ __html: payload }}></div>
}

export async function getServerSideProps() {
  // do arbitrary logic on SSR

  // Pass data to the page via props
  return {
    props: { payload: '<script>console.log("GAME OVER WITH SSR");</script>' },
  }
}

export default Dangerous
