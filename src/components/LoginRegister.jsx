import Login from './Login'
import Register from './Register';

export default function LoginRegister() {


    return (
        <div className="max-w-5xl mx-auto my-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 h-full">
                <Login />
                <Register />
            </div>
        </div>
    );
}