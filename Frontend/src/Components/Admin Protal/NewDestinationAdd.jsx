import React, { useState, useContext } from "react";
import DestinationsContext from "../../Context/Destinations/DestinationsContext";
import FileInput from "../FileInput";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "react-toastify";

const NewDestinationAdd = ({ onSaveSuccess }) => {
    const context = useContext(DestinationsContext);
    const { addDestination, isLoading } = context;
    const [formData, setFormData] = useState({
        place: "",
        city: "",
        country: "",
        type: "National",
        duration: "",
        price: "",
        rating: "",
        category: "Mountain",
        markings: "",
        description: "",
        mapTitle: "",
        mapLink: ""
    });

    const [placeImage, setPlaceImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

    const [keyHighlights, setKeyHighlights] = useState([
        { title: "", image: null }
    ]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to add a new key highlight(max 3)
    const addHighlight = () => {
        if (keyHighlights.length < 3) {
            setKeyHighlights([...keyHighlights, { title: "", image: null }]);
        }
    };

    // Function to remove a key highlight
    const removeHighlight = (index) => {
        setKeyHighlights(keyHighlights.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data for submission
        const data = new FormData();

        // Append form data
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        // Append place and background images
        data.append("placeImage", placeImage);
        data.append("backgroundImage", backgroundImage);

        // Append key highlights
        const highlightsForBackend = keyHighlights.map(kh => ({ title: kh.title }));
        data.append("keyHighlights", JSON.stringify(highlightsForBackend));

        // Append key highlight images
        keyHighlights.forEach(kh => {
            if (kh.image) {
                data.append("keyHighlightsImages", kh.image);
            }
        });

        const result = await addDestination(data);
        console.log(result);

        if(result.success){
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });

            // Reset form after successful submission
            setFormData({
                place: "", city: "", country: "", 
                type: "National", duration: "", price: "", 
                rating: "", category: "Mountain", markings: "", 
                description: "", mapTitle: "", mapLink: ""
            });

            setPlaceImage(null);
            setBackgroundImage(null);
            setKeyHighlights([{ title: "", image: null }]);

            // Notify parent component of successful save
            if(onSaveSuccess){
                onSaveSuccess();
            }
        }else{
            toast.error(result.msg || "Failed to add destination. Please try again.", {
                theme: "colored"
            })
        }
        
    };

    // Placeholder mapping for inputs
    const placeholderMap = {
        place: "Enter Place Name(e.g., Taj Mahal)",
        city: "Enter City Name(e.g., Mumbai)",
        country: "Enter Country Name(e.g., India)",
        duration: "Enter Duration (e.g., 5 Days)",
        mapTitle: "Place Map Title",
        mapLink: "Place Map Link"
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center p-4 md:p-8 border-t border-gray-800">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-800 text-white p-6 md:p-8 lg:p-10 rounded-2xl shadow-2xl w-full max-w-5xl"
            >
                <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">
                    Add New Dream Destination
                </h2>

                {/* BASIC INFO */}
                <div className="grid md:grid-cols-2 gap-6">
                    {["place", "city", "country", "duration", "mapTitle", "mapLink"].map(
                        (field) => (
                            <input
                                key={field}
                                name={field}
                                placeholder={placeholderMap[field]}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        )
                    )}

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        <option value="National">National</option>
                        <option value="International">International</option>
                    </select>

                    <input
                        type="number"
                        name="price"
                        placeholder="Price (e.g., 1500)"
                        onChange={handleChange}
                        required
                        min={0}
                        className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <input
                        type="number"
                        step="0.1"
                        name="rating"
                        placeholder="Rating (0–5)"
                        onChange={handleChange}
                        required
                        min={0}
                        max={5}
                        className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        <option value="Mountain">Mountain</option>
                        <option value="History">History</option>
                        <option value="Forest">Forest</option>
                        <option value="Beach">Beach</option>
                        <option value="Desert">Desert</option>
                        <option value="Adventurous">Adventurous</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Place and Background Images */}
                <FileInput
                    label="Place Image"
                    file={placeImage}
                    setFile={setPlaceImage}
                />

                <FileInput
                    label="Background Image"
                    file={backgroundImage}
                    setFile={setBackgroundImage}
                />

                {/* TEXT AREAS */}
                <textarea
                    name="markings"
                    placeholder="Place Markings"
                    onChange={handleChange}
                    required
                    minLength={10}
                    rows={2}
                    className="w-full mt-6 p-4 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <textarea
                    name="description"
                    placeholder="Place Description"
                    onChange={handleChange}
                    required
                    minLength={50}
                    rows={6}
                    className="w-full mt-4 p-4 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                />

                {/* KEY HIGHLIGHTS */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                        Key Highlights Places (Max 3)
                    </h3>

                    {keyHighlights.map((item, index) => (
                        <div key={index} className="bg-slate-700 p-4 rounded-xl mb-4">
                            <input
                                type="text"
                                placeholder="Highlight Place Name"
                                required
                                onChange={(e) => {
                                    const data = [...keyHighlights];
                                    data[index].title = e.target.value;
                                    setKeyHighlights(data);
                                }}
                                className="w-full p-3 bg-slate-800 rounded mb-2 outline-none focus:ring-2 focus:ring-cyan-400"
                            />

                            <FileInput
                                label="Highlight Place Image"
                                file={item.image}
                                setFile={(file) => {
                                    const data = [...keyHighlights];
                                    data[index].image = file;
                                    setKeyHighlights(data);
                                }}
                            />

                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeHighlight(index)}
                                    className="text-red-400 mt-2 cursor-pointer"
                                >
                                    Remove Highlight
                                </button>
                            )}
                        </div>
                    ))}

                    {keyHighlights.length < 3 && (
                        <button
                            type="button"
                            onClick={addHighlight}
                            className="text-cyan-400 cursor-pointer"
                        >
                            + Add Highlight Place
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-8 py-2 md:py-3 rounded-xl text-lg font-semibold ${isLoading ? 'bg-cyan-300 cursor-not-allowed' : 'bg-cyan-500 cursor-pointer hover:bg-cyan-600 transition'}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <ImSpinner9 className="animate-spin" /> Saving Destination...
                        </span>
                    ) : (
                        "Save Destination"
                    )}
                </button>
            </form>
        </div>
    );
}

export default NewDestinationAdd;