import Property from "./Property";
import { Link } from "react-router-dom";


export default function Profile() {
    return (
        <>
            <div className="flex gap-5">
                <div className="w-full md:w-1/4">
                    <div className="p-4 pb-0">
                        <div className="flex align-center justify-start pb-4">
                            <div class="mr-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white text-xl font-bold">
                                RG
                            </div>
                            <div className="">
                                <div className="text-xl">Ritesh Ghimire</div>
                                <small>ritesh@ritesh.com</small>
                            </div>
                        </div>
                    </div>
                    <ul className="p-0 border-t border-gray-400">
                        <li className="cursor-pointer p-4 hover:bg-gray-200">
                            <Link to="/profile">My Properties</Link>
                        </li>
                        <li className="cursor-pointer p-4 hover:bg-gray-200">
                            <Link to="/profile">Saved Properties</Link>
                        </li>
                        <li className="cursor-pointer p-4 hover:bg-gray-200">
                            <Link to="/profile">My Offers</Link>
                        </li>
                        <li className="cursor-pointer p-4 hover:bg-gray-200">
                            <Link to="/profile">Logout</Link>
                        </li>
                    </ul>


                </div>
                <div className="w-full md:w-3/4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                        {[...Array(10)].map((_, index) => (
                            <Property key={index} />
                        ))}
                    </div>
                </div>
            </div >

        </>
    )
}