import React, { useState, useContext, useEffect } from "react";
import DestinationsContext from "../../Context/Destinations/DestinationsContext";
import FileInput from "../FileInput";
import { toast } from "react-toastify";

const EditDestination = ({ destination, onClose }) => {
    const { updateDestination, isLoading } = useContext(DestinationsContext);

    // Form state: All fields from NewDestinationAdd
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
    const [keyHighlights, setKeyHighlights] = useState([]);

    // Prefill data when destination prop changes (modal opens)
    useEffect(() => {
        if (destination) {
            setFormData({
                place: destination.place || "",
                city: destination.city || "",
                country: destination.country || "",
                type: destination.type || "National",
                duration: destination.duration || "",
                price: destination.price || 0,
                rating: destination.rating || 0,
                category: destination.category || "Mountain",
                markings: destination.markings || "",
                description: destination.description || "",
                mapTitle: destination.mapTitle || "",
                mapLink: destination.mapLink || ""
            });

            // Initialize key highlights from existing data.
            setKeyHighlights(destination.keyHighlights.map(kh => ({
                title: kh.title,
                image: null, // New file upload for replacement
                imageURL: kh.image?.url // Existing image URL for display/preview
            })) || []);

            // Clear new file states on initial load
            setPlaceImage(null);
            setBackgroundImage(null);
        }
    }, [destination]);

    // Handle form input changes for basic fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Key Highlights Logic ---
    const addHighlight = () => {
        if (keyHighlights.length < 3) {
            setKeyHighlights([...keyHighlights, { title: "", image: null, imageURL: null }]);
        }
    };

    const removeHighlight = (index) => {
        setKeyHighlights(keyHighlights.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // Append form data
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        // Append new images if they are selected/updated
        if (placeImage) data.append("placeImage", placeImage);
        if (backgroundImage) data.append("backgroundImage", backgroundImage);

        // Append key highlights if any are provided
        if (keyHighlights.length > 0) {
            // Prepare key highlights titles for backend
            const highlightsForBackend = keyHighlights.map(kh => ({ title: kh.title }));
            data.append("keyHighlights", JSON.stringify(highlightsForBackend));

            // Append new key highlight images
            keyHighlights.forEach(kh => {
                if (kh.image) data.append("keyHighlightsImages", kh.image);
            });
        }

        const result = await updateDestination(destination._id, data);
        console.log(result);

        if(result.success) {
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });
        }else{
            toast.error(result.msg || "Failed to update destination. Please try again.", {
                theme: "colored"
            });
        }

        onClose();
    };

    // Placeholder map for consistent input definition
    const placeholderMap = {
        place: "Enter Place Name(e.g., Taj Mahal)",
        city: "Enter City Name(e.g., Mumbai)",
        country: "Enter Country Name(e.g., India)",
        duration: "Enter Duration (e.g., 5 Days)",
        mapTitle: "Place Map Title",
        mapLink: "Place Map Link"
    };

    const inputFields = ["place", "city", "country", "duration", "mapTitle", "mapLink"];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[8px] flex justify-center items-start overflow-auto z-50 pt-16 pb-16 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-800 text-white p-5 md:p-8 rounded-2xl shadow-2xl w-full max-w-5xl mt-13"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-8">
                    Edit Destination: {destination.place}
                </h2>

                {/* BASIC INFO */}
                <div className="grid md:grid-cols-2 gap-6">
                    {inputFields.map((field) => (
                        <input
                            key={field}
                            name={field}
                            placeholder={placeholderMap[field]}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    ))}

                    {/* Type Select */}
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        <option value="National">National</option>
                        <option value="International">International</option>
                    </select>

                    {/* Price Input */}
                    <input
                        type="number"
                        name="price"
                        placeholder="Price (e.g., 1500)"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min={0}
                        className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    {/* Rating Input */}
                    <input
                        type="number"
                        step="0.1"
                        name="rating"
                        placeholder="Rating (0–5)"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                        min={0}
                        max={5}
                        className="p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    {/* Category Select */}
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
                <div className="mt-8 space-y-4 border-t border-slate-700 pt-6">
                    <FileInput
                        label="Update Place Image"
                        file={placeImage}
                        setFile={setPlaceImage}
                        existingURL={destination.placeImage?.url} // Pass existing URL
                    />

                    <FileInput
                        label="Update Background Image"
                        file={backgroundImage}
                        setFile={setBackgroundImage}
                        existingURL={destination.backgroundImage?.url} // Pass existing URL
                    />
                </div>

                {/* TEXT AREAS */}
                <textarea
                    name="markings"
                    placeholder="Place Markings"
                    value={formData.markings}
                    onChange={handleChange}
                    required
                    minLength={10}
                    rows={2}
                    className="w-full mt-6 p-4 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <textarea
                    name="description"
                    placeholder="Place Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={50}
                    rows={6}
                    className="w-full mt-4 p-4 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                />

                {/* KEY HIGHLIGHTS EDIT/ADD SECTION */}
                <div className="mt-8 border-t border-slate-700 pt-6">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                        Key Highlights Places (Max 3)
                    </h3>

                    {keyHighlights.map((item, index) => (
                        <div key={index} className="bg-slate-700 p-3 md:p-4 rounded-xl mb-4 border border-cyan-700">
                            <input
                                type="text"
                                placeholder="Highlight Place Name"
                                required
                                value={item.title}
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
                                // Pass the existing image URL here
                                existingURL={item.imageURL}
                            />

                            {/* Only allow removal if there is more than one highlight */}
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeHighlight(index)}
                                    className="text-red-400 mt-2 cursor-pointer hover:text-red-500 transition"
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
                            className="text-cyan-400 cursor-pointer hover:text-cyan-500 transition font-medium"
                        >
                            + Add Key Highlight
                        </button>
                    )}
                </div>


                {/* Action Buttons */}
                <div className="flex justify-between mt-8 pt-4 border-t border-slate-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 md:px-6 md:py-3 bg-gray-600 hover:bg-gray-700 transition rounded-xl font-semibold text-lg"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-lg ${isLoading ? 'bg-cyan-300 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600 transition cursor-pointer'}`}
                    >
                        {isLoading ? "Updating..." : "Update Destination"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditDestination
