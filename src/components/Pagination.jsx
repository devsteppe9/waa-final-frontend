

export default function Pagination() {
    return (
        <>
            <div className="flex justify-center mt-8">
                <nav aria-label="Page navigation">
                    <ul className="flex items-center -space-x-px h-10 text-base">
                        <li>
                            <a href="#"
                                className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
                                <span className="sr-only">Previous</span>
                                <i className="fa-solid fa-chevron-left w-3 h-3"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-current="page"
                                className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">1</a>
                        </li>
                        <li>
                            <a href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
                        </li>
                        <li>
                            <a href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">3</a>
                        </li>
                        <li>
                            <a href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">4</a>
                        </li>
                        <li>
                            <a href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">5</a>
                        </li>
                        <li>
                            <a href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
                                <span className="sr-only">Next</span>
                                <i className="fa-solid fa-chevron-right w-3 h-3"></i>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}