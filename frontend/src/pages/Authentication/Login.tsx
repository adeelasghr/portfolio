import { useState } from "react";
import login from "../../assets/images/login.png";
import { authLogin } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../components/Shared/ErrorModal";
import loader from "../../assets/images/loader.gif";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showValidationErrorModal, setValidationErrorModal] = useState(false);
  const [validationErrorMessages, setvalidationErrorMessages] = useState<
    string[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
     setLoading(true);
    e.preventDefault();
 try {
    const result = await authLogin({ email, password });

    if (result.success && result.token) {
      // Save token
      localStorage.setItem("token", result.token);

      // (Optional) Save user info
      localStorage.setItem("user", JSON.stringify(result.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      setvalidationErrorMessages([result.message ?? ""]);
      setValidationErrorModal(true);
    }
   } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setLoading(false);
      }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center main-bg">
        <div className="w-full sm:w-full md:w-1/3 lg:w-1/3 rounded-2xl p-8 w-1/4 flex">
          {/* Login Form */}
          <div className="w-full bg-white card p-8 rounded-2xl shadow-xl">
            <div className="w-1/4 float-left flex items-center justify-center">
              <div className="relative">
                <img
                  src={login}
                  style={{ width: "65%" }}
                  className="ml-auto mr-auto"
                />
              </div>
            </div>
            <h1 className="w-3/4 float-left text-4xl mb-2">Sign In</h1>
            <p className="w-3/4 float-left text-gray-600 mb-8">
              Enter your credentials
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div className="flex items-center justify-between mb-6">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-purple-500 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
             <div className="mb-6">
  {loading ? (
    <div className="flex justify-center">
      <img src={loader} alt="Loading..." className="h-20" />
    </div>
  ) : (
    <button
      type="submit"
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      LOG IN
    </button>
  )}
</div>

            </form>
          </div>
        </div>
      </div>

      <ErrorModal
        show={showValidationErrorModal}
        errors={validationErrorMessages}
        onClose={() => setValidationErrorModal(false)}
      />
    </>
  );
};

export default Login;
