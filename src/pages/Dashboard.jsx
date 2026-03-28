import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import API from "../api/axios";
import { useEffect } from "react";
import toast from 'react-hot-toast';
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchItem, setSearchItem] = useState("");
  const [activeTab, setActiveTab] = useState("All"); 
  const [showModal, setShowModal] = useState(false);
  const [secrets,setSecrets]=useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Login");
  const [expandedId,setExpandId]=useState(null);
  const [isEditing,setIsEditing]=useState(false);
  const [currentId,setCurrentId]=useState(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    identifier: "", // Email or Key ID
    secret: "",     // Password or API Secret
    noteBody: ""
  });
  const fetchSecrets=async()=>{
    try {
      const token=localStorage.getItem("token");
      const res=await API.get("http://localhost:5000/api/secrets/all",{
        headers: {"x-auth-token": token}
      });
      setSecrets(res.data);
    } catch (err) {
      console.error("Error fetching secrets: ",err)
    }
  }
  useEffect(()=>{
    fetchSecrets();
  },[])
  useEffect(()=>{
    let timer;
    const resetTimer=()=>{
      clearTimeout(timer);
      timer=setTimeout(()=>{
        logout();
        toast.error("Session expired for your security");
      },15*60*1000);
    };
    window.addEventListener("mousemove",resetTimer);
    window.addEventListener("keydown",resetTimer);
    resetTimer();
    return ()=>{
      window.removeEventListener("mousemove",resetTimer);
      window.removeEventListener("keydown",resetTimer);
      clearTimeout(timer);
    }
  },[logout]);
  const getStrengthScore=(password)=>{
    if(!password) return 0;
    let s=0;
    if(password.length>8) s++;
    if(/[A-Z]/.test(password)) s++;
    if(/[0-9]/.test(password)) s++;
    if(/[^A-Za-z0-9]/.test(password)) s++;
    if(password.length>12) s++;
    return s;
  }
  const handleSave=async()=>{
    if (selectedCategory === "Note") {
      if (!formData.title || !formData.noteBody) {
        return toast.error("Please fill in the title and the note body");
      }
    } else if (selectedCategory === "Login") {
      if (!formData.title || !formData.url || !formData.identifier || !formData.secret) {
        return toast.error("All login fields are required");
      }
    } else if (selectedCategory === "API Key") {
      if (!formData.title || !formData.identifier || !formData.secret) {
        return toast.error("Title, Key ID, and Secret are required");
      }
    }
    if(isEditing && !currentId) {
      toast.error("Error:ID is missing for editing")
      return;
    }
    try{
      const token=localStorage.getItem("token");
      const url=isEditing ? `http://localhost:5000/api/secrets/update/${currentId}` : "http://localhost:5000/api/secrets/add";
      const method=isEditing ? "put":"post";
      const res=await API[method](url,{...formData,category:selectedCategory},{
        headers: {"x-auth-token": token}
      });
      toast.success(res.data.msg);
      handleClose();
      fetchSecrets();
    } catch(err) {
      console.error("Save Error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to save secret");
    }
  }
  const generatePassword=()=>{
      const charset="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let retVal="";
      for(let i=0;i<16;i++) {
        retVal+=charset.charAt(Math.floor(Math.random()*charset.length));
      }
      setFormData({...formData,secret:retVal});
      toast.success("Secure password generated!");
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: "", url: "", identifier: "", secret: "", noteBody: "" });
    setSelectedCategory("Login");
  };
  const handleCopy=(text)=>{
    if(!text) return;
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", {
      icon:'📋',
      style: {borderRadius: '10px', background: '#333', color: '#fff'},
    });
  };
  const handleDelete=async(s)=>{
    const targetId=s._id || s.id;
    if (!targetId) {
      alert("Error: Secret ID not found");
      return;
    }
    if(!window.confirm("Delete this secret permanently?")) return;
    try {
      const token=localStorage.getItem("token");
      await API.delete(`http://localhost:5000/api/secrets/${targetId}`,{
        headers: {"x-auth-token": token}
      });
      toast.success("Secret deleted permanently");
      fetchSecrets();
    } catch(err) {
      alert("Delete failed: "+ (err.response?.data?.error || "Server error"));
    }
  }
  const stats = [
    { label: "Stored Passwords", value: secrets.filter(s=>s.category==="Login").length, color: "text-green-400" },
    { label: "API Keys", value: secrets.filter(s=>s.category==="API Key").length, color: "text-green-400" },
    { label: "Security Status", value: "Protected", color: "text-green-400" },
  ];
  const tabs = ["All", "Logins", "API Keys", "Notes"];
  return (
    <div className="min-h-screen bg-teal-50 text-black p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center border-b border-gray-600 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Secret Vault</h1>
            <p className="text-gray-500 mt-4">
              Welcome, <span className="text-gray-500 font-medium">{user?.username}</span>. {new Date().toLocaleDateString()}
            </p>
          </div>
          <button onClick={logout} className="group flex items-center gap-2 bg-blue-600 border border-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition-all duration-300">
            <span>Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </header>
        {/* Stats grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-gray-500 text-xs uppercase font-bold tracking-widest">{stat.label}</h3>
              <p className={`text-3xl font-mono mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </section>
        {/* Search and Actions */}
        <section className="mt-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search your vault..."
              className="w-full bg-white border border-teal-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
            <span className="text-xl">+</span> Add New Secret
          </button>
        </section>
        {/* Tab filters */}
        <nav className="flex gap-4 mt-8 border-b border-teal-100 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-medium font-medium transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-600'}`}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </nav>
        {/* Empty state */}
        <main className="mt-8">
          {secrets.length === 0 ? (
            /* 1. Empty Vault State */
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-teal-200">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold text-lg">Your vault is ready.</p>
              <p className="text-gray-500 text-sm mt-1">Add your first item to see it here.</p>
            </div>
          ) : (
            /* 2. Grid for Secrets */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const filteredSecrets = secrets.filter((s) => {
                  const matchesSearch = s.title.toLowerCase().includes(searchItem.toLowerCase());
                  const matchesTab = activeTab === "All" ||
                    (activeTab === "Logins" && s.category === "Login") ||
                    (activeTab === "API Keys" && s.category === "API Key") ||
                    (activeTab === "Notes" && s.category === "Note");
                  return matchesSearch && matchesTab;
                });
                /* 3. Search Not Found State */
                if (filteredSecrets.length === 0) {
                  return (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-teal-100 shadow-sm">
                      <div className="text-4xl mb-3">
                        {searchItem !== "" ? "🔍" : activeTab === "Logins" ? "🔐" : activeTab === "API Keys" ? "🔑" : "📝"}
                      </div>
                      <p className="text-gray-700 font-semibold text-lg">
                        {searchItem!=="" ? `No results for "${searchItem}"` :
                          activeTab==="All" ? "Your vault is empty" : `No ${activeTab} found`}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">{searchItem!=="" ? "Try a different keyword." : `Click 'Add New Secret' to create your first ${activeTab.slice(0,-1)}.`}</p>
                    </div>
                  );
                }
                /* 4. Map Results */
                return filteredSecrets.map((s) => (
                  <div key={s.id || s._id} className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm relative group flex flex-col justify-between">
                    <div>
                      <span className="absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-1 bg-teal-50 text-teal-600 rounded-md">
                        {s.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">{s.title}</h3>
                      <div className="mb-4">
                        <div className="relative group/id inline-block max-w-full">
                          <p className="text-gray-500 text-sm mb-4 truncate cursor-pointer flex items-center gap-1" onClick={()=>handleCopy(s.identifier || s.url)}>{s.identifier || s.url || "Secure Note"}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover/id:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          </p>
                          <span className="absolute -top-8 left-0 bg-gray-700 text-white text-[15px] px-2 py-1 rounded shadow-lg opacity-0 group-hover/id:opacity-100 pointer-events-none transition-all duration-200 transform group-hover/id:-translate-y-1">
                            Copy?
                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-gray-700 rotate-45"></div>
                          </span>
                        </div>
                      </div>
                      {expandedId === (s.id || s._id) && (
                        <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100 animate-in fade-in zoom-in flex justify-between items-center">
                          <div className="overflow-hidden">
                            <p className="text-xs text-teal-600 font-bold mb-1 uppercase">Secret Content:</p>
                            <code className="text-sm text-black break-all">
                              {s.category === "Note" ? s.noteBody : s.secret || s.value}
                            </code>
                          </div>
                          <button
                            title="Copy"
                            className="p-2 hover:bg-teal-200 rounded-full transition-colors text-teal-600 shrink-0 ml-2"
                            onClick={() => handleCopy(s.category === "Note" ? s.noteBody : s.secret || s.value)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-4">
                        <button
                          className="text-blue-600 font-semibold text-sm hover:underline"
                          onClick={() => setExpandId(expandedId === (s.id || s._id) ? null : (s.id || s._id))}
                        >
                          {expandedId === (s.id || s._id) ? "Hide " : " View "}Secret
                        </button>
                        <div className="flex gap-10">
                          <button
                            className="text-blue-600 font-semibold hover:underline text-sm"
                            onClick={() => {
                              const id = s._id || s.id;
                              if (!id) return toast.error("Could not find secret ID");
                              setIsEditing(true);
                              setCurrentId(id);
                              setFormData({
                                title: s.title || "",
                                url: s.url || "",
                                identifier: s.identifier || "",
                                secret: s.secret || s.value || "",
                                noteBody: s.noteBody || "",
                              });
                              setSelectedCategory(s.category);
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button className="text-red-400 hover:text-red-600 text-sm" onClick={() => handleDelete(s)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              })()}
            </div>
          )}
        </main>
      </div>
      {/* Add Secret Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-teal-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Secure New Item</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-red-500 transition-colors text-2xl">✕</button>
            </div>
            <div className="space-y-4">
              {/* Category Selector */}
              <div className="flex gap-2 p-1 bg-teal-50 rounded-xl border border-teal-100 mb-2">
                {["Login", "API Key", "Note"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${selectedCategory === cat ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {cat}
                  </button>
                ))}
              </div>
              {/* Title Input */}
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={selectedCategory === "Note" ? "Note Title" : "Title "}
                className="w-full bg-white border border-teal-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {/* Website URL (Logins Only) */}
              {selectedCategory === "Login" && (
                <input
                  required
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="Website URL"
                  className="w-full bg-white border border-teal-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}
              {/* Identifier (Email/Key ID) */}
              {selectedCategory !== "Note" && (
                <input
                  required
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  autoComplete="one-time-code"
                  placeholder={selectedCategory === "API Key" ? "Key ID / Service Provider" : "Email / Username"}
                  className="w-full bg-white border border-teal-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}
              {/* Secret (Password/API Key) */}
              {selectedCategory !== "Note" && (
                <div className="relative">
                    <input
                    required
                    type="password"
                    name="secret"
                    value={formData.secret}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder={selectedCategory === "API Key" ? "Paste API Secret Key" : "Password"}
                    className="w-full bg-white border border-teal-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none pr-24"
                  />
                  {formData.secret && (
                    <div className="mt-2 px-1">
                      <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4, 5].map((level)=>{
                          const score=getStrengthScore(formData.secret);
                          const colors=["bg-gray-200","bg-red-500","bg-orange-500","bg-yellow-500","bg-blue-500","bg-green-500"];
                          return (
                            <div key={level}
                              className={`flex-1 rounded-full transition-all duration-300 ${
                              level<=score ? colors[score] : "bg-gray-100"
                              }`}>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-[10px] mt-1 text-gray-400 font-bold uppercase text-right">
                        {["Empty","Weak","Fair","Good","Strong","Very Secure"][getStrengthScore(formData.secret)]}
                      </p>
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={generatePassword}
                    className="absolute right-2 top-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-teal-200 transition-colors">
                    Generate
                  </button>
                </div>
              )}
              {/* Note Body */}
              {selectedCategory === "Note" && (
                <textarea
                  required
                  name="noteBody"
                  value={formData.noteBody}
                  onChange={handleChange}
                  placeholder="Type your secure note here..."
                  rows="5"
                  className="w-full bg-white border border-teal-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none resize-none text-gray-700"
                ></textarea>
              )}
              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-blue-700 shadow-lg transition-all">
                {selectedCategory === "Note" ? "Encrypt & Save Note" : "Encrypt & Save to Vault"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;