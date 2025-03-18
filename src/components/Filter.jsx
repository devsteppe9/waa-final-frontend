

export default function Filter() {
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="text-gray-700 mb-3 md:mb-0">
                    <span className="font-semibold">256</span> properties found
                </div>
                <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-700">Sort by:</span>
                    <select title="sorting" id="sorting"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2">
                        <option value="relevant">Most Relevant</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>
        </>
    )
}