import React from 'react'

const FileInput = ({ label, file, setFile, existingURL }) => {
    // Determine the display text for the file name
    const displayFileName = file 
        ? file.name 
        : (existingURL ? "Existing file uploaded" : "No file chosen");

    return (
        <div className="mt-4">
            <p className="mb-1">{label}</p>

            <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-pointer">

                {/* Hidden original input */}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                {/* Choose button */}
                <span className="bg-[#0bb0bc] px-3 py-0.5  md:px-7 md:py-1 rounded text-white">
                    Choose File
                </span>

                {/* Vertical separator */}
                <span className="w-[2px] h-6 bg-white"></span>

                {/* File name or default text */}
                <span className="text-gray-300">
                    {displayFileName}
                </span>
            </label>
        </div>
    )
}

export default FileInput
