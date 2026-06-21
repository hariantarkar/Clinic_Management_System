import { testConnection } from "../../services/TestService";
 

function Home() {

    const checkBackend = async () => {
        try {
            const response = await testConnection();
            console.log(response.data);
            alert(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Clinic Management System</h1>

            <button onClick={checkBackend}>
                Check Backend
            </button>
        </div>
    );
}

export default Home;