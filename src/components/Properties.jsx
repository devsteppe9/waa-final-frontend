import Property from './Property'


export default function Properties() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(10)].map((_, index) => (
                    <Property key={index} />
                ))}
            </div>
        </>
    )
}