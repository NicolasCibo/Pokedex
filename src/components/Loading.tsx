import Spinner from "./Spinner"

function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
        <Spinner />
        <span className="text-white text-2xl">Loading...</span>
    </div>
  )
}

export default Loading