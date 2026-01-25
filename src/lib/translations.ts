export const translations: Record<string, unknown> = {
    en: {
        nav: {
            home: "Home",
            papers: "Papers",
            about: "About",
            admin: "Admin Panel",
            signIn: "Sign In",
            logout: "Logout",
            profile: "User Profile"
        },
        footer: {
            description: "The Meritorious Past Paper Management System for students and educators. Designed for excellence and academic success.",
            rights: "All Rights Reserved"
        },
        hero: {
            eyebrow: "Meritorious",
            title: {
                main: "Merit",
                highlight: "O/L Series",
                sub: ""
            },
            description: "Master your exams with ease. Access a comprehensive database of past papers, categorized and filtered for your academic success.",
            cta: {
                primary: "See Papers",
                secondary: "Contribute"
            },
            stats: {
                visitors: "Total Visitors",
                papers: "Papers Available",
                downloads: "Total Downloads",
                excellence: "Years of excellence"
            }
        },
        filters: {
            title: "Quick Filters",
            search: "Search papers...",
            reset: "Reset Filters",
            placeholders: {
                subject: "Subjects",
                year: "Years",
                language: "Languages"
            }
        },
        papers: {
            title: "Available Papers",
            empty: {
                title: "No papers found",
                description: "Try adjusting your filters or search query.",
                reset: "Reset all filters"
            },
            card: {
                addedBy: "Added by",
                edit: "Edit Paper",
                delete: "Delete Paper",
                confirmDelete: "Are you sure you want to delete"
            },
            alerts: {
                deleteSuccess: "Paper deleted successfully",
                deleteError: "Failed to delete paper"
            }
        },
        about: {
            hero: {
                title: "Empowering Students Through",
                highlight: "Organized Knowledge",
                description: "Merit O/L series is a modern document management system designed to make past paper accessibility seamless, fast, and reliable for students and educators worldwide."
            },
            features: [
                {
                    title: "Extensive Collection",
                    description: "Access a vast library of past papers and marking schemes across multiple years and subjects."
                },
                {
                    title: "Fast Discovery",
                    description: "Find exactly what you need in seconds with our optimized filtering and search experience."
                },
                {
                    title: "Verified Content",
                    description: "All uploaded papers are reviewed to ensure accuracy and high quality for student preparation."
                },
                {
                    title: "Community Driven",
                    description: "Built for students, by students and educators committed to academic excellence."
                }
            ],
            mission: {
                title: "Our Mission",
                description: "To build the most accessible and student-friendly repository of academic resources, eliminating the barriers to high-quality preparation material."
            }
        },
        addPaper: {
            dashboard: "Upload Dashboard",
            title: {
                add: "Add New",
                edit: "Edit",
                highlight: "Paper"
            },
            form: {
                year: "Publication Year",
                language: "Language",
                name: "Display Name",
                subject: "Academic Subject",
                placeholder: {
                    name: "e.g. Mathematics 2023",
                    subject: "Select Subject"
                },
                dropzone: {
                    keep: "Leave empty to keep existing PDF"
                },
                submit: {
                    save: "Save Changes",
                    publish: "Publish"
                },
                alerts: {
                    selectPdf: "Please select a PDF file",
                    saveSuccess: "Paper saved successfully",
                    saveError: "Failed to save paper"
                },
                parts: {
                    p1: "Part 1 (Question)",
                    p2: "Part 2 (Question)",
                    scheme: "Marking Scheme"
                },
                help: {
                    edit: "Update existing paper details",
                    add: "Upload and catalogue a new past paper"
                }
            }
        },
        admin: {
            dashboard: {
                title: "Admin Controls",
                subtitle: "Manage and organize your paper database.",
                systemConfig: "System Config",
                managedPapers: "Managed Papers"
            },
            controls: {
                title: "System Controls",
                loading: "Loading system controls...",
                success: {
                    filters: "Filters updated successfully!",
                    socials: "Social links updated successfully!"
                },
                error: {
                    filters: "Failed to update filters",
                    socials: "Failed to update social links"
                }
            }
        },
        contribute: {
            title: "Support The Project",
            pitch: {
                main: "Buy us a coffee,",
                highlight: "fuel the mission.",
                description: "Merit O/L series is free and open-source. Your contributions help cover server costs and encourage further development of educational tools."
            },
            or: "Or custom amount",
            customPlaceholder: "Enter custom amount",
            payment: {
                title: "Payment Details",
                total: "Total to pay"
            }
        }
    },
    ta: {
        nav: {
            home: "முகப்பு",
            papers: "வினாத்தாள்கள்",
            about: "பற்றி",
            admin: "நிர்வாக குழு",
            signIn: "உள்நுழைய",
            logout: "வெளியேறு",
            profile: "பயனர் விவரம்"
        },
        footer: {
            description: "மாணவர்கள் மற்றும் கல்வியாளர்களுக்கான மெரிடோரியஸ் வினாத்தாள் மேலாண்மை அமைப்பு. சிறந்து விளங்க மற்றும் கல்வி வெற்றிக்காக வடிவமைக்கப்பட்டது.",
            rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை"
        },
        hero: {
            eyebrow: "மெரிடோரியஸ் வினாத்தாள் மேலாண்மை அமைப்பு",
            title: {
                main: "Merit",
                highlight: "O/L",
                sub: "Series"
            },
            description: "உங்கள் கல்வி வெற்றிக்குத் தேவையான வினாத்தாள்களின் விரிவான தரவுத்தளத்தை ஒரே இடத்தில் அணுகுங்கள்.",
            cta: {
                primary: "வினாத்தாள்களைக் காண்க",
                secondary: "பங்களிக்கவும்"
            },
            stats: {
                visitors: "மொத்த பார்வையாளர்கள்",
                papers: "கிடைக்கக்கூடிய வினாத்தாள்கள்",
                downloads: "மொத்த பதிவிறக்கங்கள்",
                excellence: "ஆண்டுகள் அனுபவம்"
            }
        },
        filters: {
            title: "விரைவான வடிப்பான்கள்",
            search: "தேடுக...",
            reset: "வடிப்பான்களை மீட்டமை",
            placeholders: {
                subject: "பாடங்கள்",
                year: "ஆண்டுகள்",
                language: "மொழிகள்"
            }
        },
        papers: {
            title: "கிடைக்கக்கூடிய வினாத்தாள்கள்",
            empty: {
                title: "வினாத்தாள்கள் எதுவும் இல்லை",
                description: "உங்கள் வடிப்பான்கள் அல்லது தேடலை மாற்ற முயற்சிக்கவும்.",
                reset: "அனைத்தையும் மீட்டமை"
            },
            card: {
                addedBy: "பதிவேற்றியவர்",
                edit: "திருத்து",
                delete: "நீக்கு",
                confirmDelete: "நிச்சயமாக நீக்க விரும்புகிறீர்களா"
            },
            alerts: {
                deleteSuccess: "வினாத்தாள் வெற்றிகரமாக நீக்கப்பட்டது",
                deleteError: "வினாத்தாளை நீக்க முடியவில்லை"
            }
        },
        about: {
            hero: {
                title: "மாணவர்களை மேம்படுத்துதல்",
                highlight: "ஒழுங்கமைக்கப்பட்ட அறிவு",
                description: "Merit O/L series என்பது வினாத்தாள் அணுகலை எளிமையாகவும், வேகமாகவும் மற்றும் நம்பகமானதாகவும் மாற்ற வடிவமைக்கப்பட்ட ஒரு நவீன ஆவண மேலாண்மை அமைப்பாகும்."
            },
            features: [
                {
                    title: "விரிவான தொகுப்பு",
                    description: "பல ஆண்டுகள் மற்றும் பாடங்களின் வினாத்தாள்கள் மற்றும் புள்ளித்திட்டங்களின் விரிவான நூலகத்தை அணுகவும்."
                },
                {
                    title: "விரைவான தேடல்",
                    description: "எங்கள் உகந்த தேடல் அனுபவத்தின் மூலம் உங்களுக்குத் தேவையானதை நொடிகளில் கண்டறியவும்."
                },
                {
                    title: "சரிபார்க்கப்பட்ட உள்ளடக்கம்",
                    description: "அனைத்து பதிவேற்றப்பட்ட தாள்களும் துல்லியம் மற்றும் தரம் உறுதி செய்ய சரிபார்க்கப்படுகின்றன."
                },
                {
                    title: "சமூகத்தால் இயக்கப்படுகிறது",
                    description: "கல்வி சிறப்பிற்காக அர்ப்பணிக்கப்பட்ட மாணவர்கள் மற்றும் கல்வியாளர்களால் உருவாக்கப்பட்டது."
                }
            ],
            mission: {
                title: "எங்கள் நோக்கம்",
                description: "கல்வி வளங்களை மாணவர்கள் எளிதில் அணுகக்கூடிய வகையில் உருவாக்குவதே எங்களின் நோக்கம்."
            }
        },
        addPaper: {
            dashboard: "பதிவேற்ற மேலாண்மை",
            title: {
                add: "புதிய",
                edit: "மாற்றுக",
                highlight: "வினாத்தாள்"
            },
            form: {
                year: "வெளியிடப்பட்ட ஆண்டு",
                language: "மொழி",
                name: "பெயர்",
                subject: "பாடம்",
                placeholder: {
                    name: "உதாரணம்: கணிதம் 2023",
                    subject: "பாடத்தைத் தேர்ந்தெடுக்கவும்"
                },
                dropzone: {
                    keep: "ஏற்கனவே உள்ள PDF-ஐ வைத்திருக்க காலியாக விடவும்"
                },
                submit: {
                    save: "மாற்றங்களைச் சேமி",
                    publish: "வெளியிடு"
                },
                alerts: {
                    selectPdf: "தயவுசெய்து ஒரு PDF கோப்பைத் தேர்ந்தெடுக்கவும்",
                    saveSuccess: "வினாத்தாள் வெற்றிகரமாக சேமிக்கப்பட்டது",
                    saveError: "வினாத்தாளை சேமிக்க முடியவில்லை"
                },
                parts: {
                    p1: "பகுதி 1 (வினா)",
                    p2: "பகுதி 2 (வினா)",
                    scheme: "புள்ளித்திட்டம்"
                },
                help: {
                    edit: "ஏற்கனவே உள்ள வினாத்தாள் விவரங்களைப் புதுப்பிக்கவும்",
                    add: "புதிய வினாத்தாளைப் பதிவேற்றவும்"
                }
            }
        },
        admin: {
            dashboard: {
                title: "நிர்வாகக் கட்டுப்பாடுகள்",
                subtitle: "உங்கள் வினாத்தாள் தரவுத்தளத்தை நிர்வகிக்கவும் மற்றும் ஒழுங்கமைக்கவும்.",
                systemConfig: "கணினி கட்டமைப்பு",
                managedPapers: "நிர்வகிக்கப்படும் தாள்கள்"
            },
            controls: {
                title: "கணினி கட்டுப்பாடுகள்",
                loading: "கணினி கட்டுப்பாடுகள் ஏற்றப்படுகின்றன...",
                success: {
                    filters: "வடிப்பான்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!",
                    socials: "சமூக இணைப்புகள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!"
                },
                error: {
                    filters: "வடிப்பான்களைப் புதுப்பிக்க முடியவில்லை",
                    socials: "சமூக இணைப்புகளைப் புதுப்பிக்க முடியவில்லை"
                }
            }
        },
        contribute: {
            title: "திட்டத்தை ஆதரிக்கவும்",
            pitch: {
                main: "எங்களுக்கு ஒரு காபி வாங்கித் தாருங்கள்,",
                highlight: "பணியை ஊக்கப்படுத்துங்கள்.",
                description: "Merit O/L series இலவசம் மற்றும் திறந்த மூலமாகும். உங்கள் பங்களிப்புகள் சேவையக செலவுகளை ஈடுகட்டவும், கல்வி கருவிகளின் மேம்பாட்டை ஊக்குவிக்கவும் உதவுகின்றன."
            },
            or: "அல்லது தனிப்பயன் தொகை",
            customPlaceholder: "தொகையை உள்ளிடவும்",
            payment: {
                title: "கட்டண விவரங்கள்",
                total: "செலுத்த வேண்டிய மொத்தம்"
            }
        }
    }
};
