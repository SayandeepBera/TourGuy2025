import React, { useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import GalleryContext from '../Context/Gallery/GalleryContext';
import AuthContext from '../Context/Authentication/AuthContext';
import { toast } from 'react-toastify';
import DeleteConfirmation from './DeleteConfirmation';

// Static images
import trackingImg from './Images/g1.jpg';
import desertImg from './Images/g2.jpg';
import historicImg from './Images/g3.avif';
import underwaterImg from './Images/g4.jpg';
import skyImg from './Images/g5.jpeg';
import waterfallImg from './Images/g6.jpg';
import CategoryMomentsView from './CategoryMomentsView';


const Gallery = () => {
    const { getGalleryImagesByCategory, deleteGalleryImage, isLoading } = useContext(GalleryContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryMoments, setCategoryMoments] = useState([]);
    const { userRole } = useContext(AuthContext);

    // Check if the user is an admin
    const isAdmin = userRole === "admin";

    // Gallery images
    const galleryImg = [
        {
            name: 'Mountain View',
            img: trackingImg,
        },
        {
            name: 'Desert Safari',
            img: desertImg,
        },
        {
            name: 'History Visit',
            img: historicImg,
        },
        {
            name: 'Beach Adventure',
            img: underwaterImg,

        },
        {
            name: 'Adventurous Journey',
            img: skyImg,
        },
        {
            name: 'Other',
            img: waterfallImg,
        }
    ]

    // Function to open a category
    const openCategory = async (categoryName) => {
        setSelectedCategory(categoryName);

        const res = await getGalleryImagesByCategory(categoryName);
        console.log("Get Gallery Images By Category Result:", result);

        if (res.success) {
            setCategoryMoments(res.result.moments);
        }
    }

    // Handle delete confirmation
    const handleDelete = async (id, placeName) => {
        // Create a unique toast ID
        const toastId = toast.info(
            <div className='flex gap-1 items-start'>
                <div className='text-xl mt-3 shrink-0'>
                    <BsInfoCircleFill />
                </div>
                <DeleteConfirmation
                    message={`Are you sure you want to remove this moment from ${placeName}?`}
                    onCancel={() => toast.dismiss(toastId)} // Close if user clicks cancel
                    onConfirm={() => {
                        toast.dismiss(toastId); // Close the confirm toast
                        proceedWithDelete(id); // Proceed with deletion
                    }}
                />
            </div>,

            {
                icon: false,
                position: "top-center",
                autoClose: false, // Wait for user action
                closeOnClick: false,
                draggable: false,
                style: { width: '95vw', maxWidth: '550px', borderRadius: '15px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderBottom: '4px solid #707c7c', margin: '0 auto' }
            }
        );
    }

    // Function to delete a moment
    const proceedWithDelete = async (id) => {
        const result = await deleteGalleryImage(id);

        if (result.success) {
            toast.success(result.msg, {
                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
            });

            setCategoryMoments(prevMoments => prevMoments.filter(moment => moment._id !== id));
        } else {
            toast.error(result.msg || "Failed to delete moment.", {
                theme: "colored"
            });
        }
    }

    return (
        <div className="py-16 md:py-18 lg:py-20 bg-[#0F172A] border-y border-gray-800 px-4">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg-px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
                    className="text-[1.65rem] md:text-[2rem] lg:text-[2.45rem] font-extrabold text-white text-center mb-2"
                >
                    Cinematic Journeys: The <span className="text-[#00C4CC]">TourGuy</span> Gallery
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.2 }}  
                    className="text-base md:text-lg lg:text-xl text-gray-400 mb-12 md:mb-14 lg:mb-16 text-center max-w-3xl mx-auto"
                >
                    A visual showcase of the unique moments unlocked by our verified guides.
                </motion.p>

                <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.4 }} 
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                    {galleryImg.map((cat, index) => (
                        <div key={index} className="rounded-xl shadow-2xl overflow-hidden hover:shadow-[#00C4CC]/30 transition duration-300 transform hover:scale-[1.02]">
                            <div className="relative block h-48 group cursor-pointer" onClick={() => openCategory(cat.name)}>
                                <img
                                    src={cat.img}
                                    alt={cat.name}
                                    className="w-full h-48 object-cover transition duration-700 group-hover:scale-110"
                                />

                                <div className="absolute bg-gradient-to-t from-black/60 to-transparent inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-3">
                                    <h3 className="text-xl text-center font-bold text-white mb-2 transition duration-300 transform translate-y-4 group-hover:translate-y-0">{cat.name}</h3>
                                    <button className="text-white text-sm px-3 py-1 rounded-full border-2 border-[#00C4CC] hover:shadow-[0_0_15px_#00C4CC] transition-all duration-300 hover:bg-gradient-to-r from-[#081b29] to-[#0ef]">VIEW MOMENT</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* FULL SCREEN CATEGORY VIEW */}
            <AnimatePresence>
                {selectedCategory && (
                    <CategoryMomentsView
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categoryMoments={categoryMoments}
                        isLoading={isLoading}
                        isAdmin={isAdmin}
                        handleDelete={handleDelete}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default Gallery
