document.addEventListener('DOMContentLoaded', () => {
    // Quiz data with questions, options, and answers for each part of the shark skeleton
    // Limited to just 6 points as requested
    const quizData = [
        {
            pointId: 0,
            location: { x: 45, y: 20 },
            title: "Dorsal Fin",
            question: "How many dorsal fins do most sharks have?",
            options: [
                "One",
                "Two",
                "Three",
                "Four"
            ],
            answer: 1, // Changed from 2 to 1 (which is "Two")
            explanation: "Most sharks have two dorsal fins, but some species like the Port Jackson shark have a spine in front of each dorsal fin for protection!"
        },
        {
            pointId: 1,
            location: { x: 47, y: 35 },
            title: "Vertebral Column",
            question: "What material is a shark's vertebral column primarily composed of?",
            options: [
                "Bone",
                "Cartilage",
                "Keratin",
                "Chitin"
            ],
            answer: 1, // This is correct (Cartilage)
            explanation: "Unlike bony fish, sharks have skeletons made of cartilage, which is lighter than bone and provides flexibility."
        },
        {
            pointId: 2,
            location: { x: 73, y: 53 },
            title: "Jaw Structure",
            question: "How are shark teeth attached to their jaws?",
            options: [
                "Deep roots like human teeth",
                "Fused to the jawbone",
                "Embedded in soft tissue",
                "Connected by ligaments"
            ],
            answer: 2, // This is correct (Embedded in soft tissue)
            explanation: "Shark teeth aren't attached to the jaw by roots but are embedded in soft tissue, allowing them to be easily replaced when lost."
        },
        {
            pointId: 3,
            location: { x: 43, y: 65 },
            title: "Pectoral Fins",
            question: "What is the primary function of a shark's pectoral fins?",
            options: [
                "Propulsion",
                "Steering and lift",
                "Defense against predators",
                "Attracting mates"
            ],
            answer: 1, // This is correct (Steering and lift) 
            explanation: "Pectoral fins provide lift and allow sharks to steer, bank, and maintain position in the water column."
        },
        {
            pointId: 4,
            location: { x: 57, y: 45 },
            title: "Gill Arches",
            question: "How many gill slits do most sharks have?",
            options: [
                "5",
                "6",
                "7",
                "8"
            ],
            answer: 0, // This is correct (5)
            explanation: "Most sharks have 5 gill slits, though some primitive species have 6 or 7."
        },
        {
            pointId: 5,
            location: { x: 11, y: 35 },
            title: "Caudal Fin",
            question: "What is the shape of a shark's caudal fin called?",
            options: [
                "Symmetrical",
                "Homocercal",
                "Heterocercal",
                "Diphycercal",
            ],
            answer: 2, // Changed from 3 to 2 (which is "Heterocercal")
            explanation: "Sharks have heterocercal tails with an enlarged upper lobe, which helps provide lift as they swim."
        }
    ];

    let currentPointId = null;
    let answeredPointIds = new Set(); // Track which points have been answered correctly
    let attemptedPointIds = new Set(); // Track which points have been attempted
    let score = 0;
    let answeredQuestions = 0;
    const totalQuestions = quizData.length;
    
    // DOM elements
    const sharkImage = document.getElementById('shark-image');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const quizModal = document.getElementById('quiz-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalQuestion = document.getElementById('modal-question');
    const modalOptions = document.getElementById('modal-options');
    const modalFeedback = document.getElementById('modal-feedback');
    const modalNext = document.getElementById('modal-next');
    const modalClose = document.getElementById('modal-close');
    const completionModal = document.getElementById('completion-modal');
    const completionMessage = document.getElementById('completion-message');
    const tryAgainButton = document.getElementById('try-again');
    
    // Initialize the quiz
    function initializeQuiz() {
        score = 0;
        answeredQuestions = 0;
        answeredPointIds.clear();
        attemptedPointIds.clear();
        updateProgressBar();
        createInteractivePoints();
        
        // Hide modal when clicking close
        modalClose.addEventListener('click', () => {
            quizModal.classList.add('hidden');
            modalFeedback.textContent = '';
            modalFeedback.classList.remove('text-green-600', 'text-red-600');
        });
        
        // Next point button functionality - find next unanswered point
        modalNext.addEventListener('click', () => {
            quizModal.classList.add('hidden');
            modalFeedback.textContent = '';
            modalFeedback.classList.remove('text-green-600', 'text-red-600');
            
            // Find the next unanswered point id
            findAndHighlightNextPoint();
        });
        
        // Try again button functionality
        if (tryAgainButton) {
            tryAgainButton.addEventListener('click', () => {
                completionModal.classList.add('hidden');
                resetQuiz();
            });
        }
        
        // Add resize event listener for responsive behavior
        window.addEventListener('resize', adjustPointPositions);
    }
    
    // Adjust point positions on window resize for responsiveness
    function adjustPointPositions() {
        const points = document.querySelectorAll('.interactive-point, .point-label');
        if (points.length === 0) return;
        
        // Force a small delay to ensure image dimensions are updated
        setTimeout(() => {
            // Recreate all points to ensure they're positioned correctly on the resized image
            createInteractivePoints();
        }, 200);
    }
    
    // Find and highlight the next point that hasn't been answered correctly yet
    function findAndHighlightNextPoint() {
        // Get all unanswered points
        const unansweredPoints = quizData.filter(point => !answeredPointIds.has(point.pointId));
        
        if (unansweredPoints.length > 0) {
            // Get the first unanswered point
            const nextPoint = unansweredPoints[0];
            
            // Find and highlight the point on the image
            const pointElement = document.querySelector(`.interactive-point[data-point-id="${nextPoint.pointId}"]`);
            if (pointElement) {
                // Add a temporary highlight effect
                pointElement.classList.add('highlight');
                // Scroll to the point if needed
                pointElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    pointElement.classList.remove('highlight');
                }, 2000);
            }
        }
    }
    
    // Create interactive points on the shark image
    function createInteractivePoints() {
        const sharkContainer = document.querySelector('.shark-container');
        if (!sharkContainer) return;
        
        // Clear any existing points
        const existingPoints = document.querySelectorAll('.interactive-point, .point-label');
        existingPoints.forEach(point => point.remove());
        
        // Create new points from quiz data
        quizData.forEach(point => {
            // Create the interactive point
            const pointElement = document.createElement('div');
            pointElement.classList.add('interactive-point');
            pointElement.style.left = `${point.location.x}%`;
            pointElement.style.top = `${point.location.y}%`;
            pointElement.setAttribute('data-point-id', point.pointId);
            sharkContainer.appendChild(pointElement);
            
            // If this point was already answered correctly, mark it accordingly
            if (answeredPointIds.has(point.pointId)) {
                pointElement.classList.add('completed-point', 'answered-correctly');
            } 
            // If it was attempted but not answered correctly
            else if (attemptedPointIds.has(point.pointId)) {
                pointElement.classList.add('attempted-point');
            }
            
            // Create a label for the point
            const labelElement = document.createElement('div');
            labelElement.classList.add('point-label');
            labelElement.style.left = `${point.location.x}%`;
            labelElement.style.top = `${point.location.y}%`;
            labelElement.textContent = point.title;
            sharkContainer.appendChild(labelElement);
            
            // Add click event
            pointElement.addEventListener('click', () => handlePointClick(point.pointId));
        });
    }
    
    // Handle clicking on a point
    function handlePointClick(pointId) {
        currentPointId = pointId;
        const pointData = quizData.find(item => item.pointId === pointId);
        
        if (pointData) {
            // Display the question modal
            modalTitle.textContent = pointData.title;
            modalQuestion.textContent = pointData.question;
            modalOptions.innerHTML = '';
            
            // Create option buttons with animated hover effect
            pointData.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-btn', 'w-full', 'text-left', 'bg-white', 'hover:bg-blue-50', 'p-3', 'rounded-lg', 'border', 'border-gray-200', 'transition', 'duration-200', 'flex', 'items-center');
                
                // Add icon space that will only be visible when selected
                const iconSpan = document.createElement('span');
                iconSpan.classList.add('mr-2', 'w-5', 'inline-block');
                button.prepend(iconSpan);
                
                // Only disable if the point has been answered correctly
                if (answeredPointIds.has(pointId)) {
                    button.disabled = true;
                    
                    // If this was the correct answer, highlight it
                    if (index === pointData.answer) {
                        button.classList.add('bg-green-100', 'border-green-500');
                        iconSpan.innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
                    }
                } else {
                    // Add click handler to check answer
                    button.addEventListener('click', () => checkAnswer(index));
                }
                
                modalOptions.appendChild(button);
            });
            
            // Get the feedback container
            const feedbackContainer = document.getElementById('feedback-container');
            const feedbackIcon = document.getElementById('feedback-icon');
            
            // Update modal buttons based on whether the point has been answered correctly
            if (answeredPointIds.has(pointId)) {
                feedbackContainer.classList.remove('hidden');
                modalFeedback.textContent = pointData.explanation;
                modalFeedback.classList.add('text-green-600');
                feedbackIcon.className = 'fas fa-check-circle mt-1 mr-2 text-green-500';
                modalNext.textContent = "Next Point";
                modalNext.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>Next Point';
            } else if (attemptedPointIds.has(pointId)) {
                feedbackContainer.classList.remove('hidden');
                modalFeedback.textContent = "Try again!";
                modalFeedback.classList.add('text-blue-600');
                feedbackIcon.className = 'fas fa-info-circle mt-1 mr-2 text-blue-500';
                modalNext.textContent = "Skip Question";
                modalNext.innerHTML = '<i class="fas fa-forward mr-2"></i>Skip Question';
            } else {
                feedbackContainer.classList.add('hidden');
                modalFeedback.textContent = '';
                modalNext.textContent = "Skip Question";
                modalNext.innerHTML = '<i class="fas fa-forward mr-2"></i>Skip Question';
            }
            
            // Show the modal with animation
            quizModal.classList.remove('hidden');
            setTimeout(() => {
                const questionCard = document.querySelector('.question-card');
                if (questionCard) questionCard.classList.add('aos-animate');
            }, 10);
        }
    }
    
    // Check if the answer is correct
    function checkAnswer(selectedIndex) {
        const pointData = quizData.find(item => item.pointId === currentPointId);
        
        // Track that this point has been attempted
        attemptedPointIds.add(currentPointId);
        
        // Get all option buttons
        const optionButtons = modalOptions.querySelectorAll('button');
        const selectedButton = optionButtons[selectedIndex];
        const correctButton = optionButtons[pointData.answer];
        
        // Get the feedback container elements
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackIcon = document.getElementById('feedback-icon');
        
        if (pointData) {
            // Highlight the selected answer
            if (selectedIndex === pointData.answer) {
                // Correct answer - first clean up any previous wrong answer attempts
                optionButtons.forEach(button => {
                    // Remove red styling from any previously wrong answers
                    button.classList.remove('bg-red-100', 'border-red-500');
                    // Clear any error icons
                    const iconSpan = button.querySelector('span');
                    if (iconSpan) {
                        iconSpan.innerHTML = '';
                    }
                    // Re-enable any buttons that were disabled due to wrong answers
                    button.disabled = false;
                });
                
                // Show the correct answer styling
                selectedButton.classList.add('bg-green-100', 'border-green-500');
                selectedButton.querySelector('span').innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
                
                // Show feedback with animation
                feedbackContainer.classList.remove('hidden');
                feedbackIcon.className = 'fas fa-check-circle mt-1 mr-2 text-green-500';
                modalFeedback.textContent = pointData.explanation;
                modalFeedback.className = 'text-green-600 font-medium flex-grow';
                
                // Only increment score and mark as answered if this is the first time getting it right
                if (!answeredPointIds.has(currentPointId)) {
                    score++;
                    answeredQuestions++;
                    answeredPointIds.add(currentPointId);
                    
                    // Update progress
                    updateProgressBar();
                }
                
                // Mark point as correctly answered
                const pointElement = document.querySelector(`.interactive-point[data-point-id="${currentPointId}"]`);
                if (pointElement) {
                    pointElement.classList.add('completed-point', 'answered-correctly');
                    pointElement.classList.remove('attempted-point');
                }
                
                // Disable all buttons since question is now correctly answered
                optionButtons.forEach(button => {
                    button.disabled = true;
                    button.classList.remove('hover:bg-blue-50');
                });
                
                // Change button text
                modalNext.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>Next Point';
                
                // Show completion modal if all questions answered
                if (answeredQuestions >= totalQuestions) {
                    setTimeout(() => {
                        showCompletionModal();
                    }, 1500);
                }
            } else {
                // Wrong answer - elegant feedback without delay
                selectedButton.classList.add('bg-red-100', 'border-red-500');
                selectedButton.querySelector('span').innerHTML = '<i class="fas fa-times-circle text-red-500"></i>';
                selectedButton.disabled = true;
                
                // Show feedback container if hidden
                feedbackContainer.classList.remove('hidden');
                feedbackIcon.className = 'fas fa-info-circle mt-1 mr-2 text-blue-500';
                modalFeedback.textContent = "Try again!";
                modalFeedback.className = 'text-blue-600 font-medium flex-grow';
                
                // Mark point as attempted but not correctly answered
                const pointElement = document.querySelector(`.interactive-point[data-point-id="${currentPointId}"]`);
                if (pointElement) {
                    pointElement.classList.add('attempted-point');
                }
            }
        }
    }
    
    // Update the progress bar
    function updateProgressBar() {
        if (progressBar && progressText) {
            const progressPercent = (answeredQuestions / totalQuestions) * 100;
            progressBar.style.width = `${progressPercent}%`;
            progressText.textContent = `${answeredQuestions}/${totalQuestions}`;
        }
    }
    
    // Show completion modal
    function showCompletionModal() {
        quizModal.classList.add('hidden');
        completionModal.classList.remove('hidden');
        
        // Create the completion message
        const scoreMessage = document.createElement('div');
        scoreMessage.textContent = `You've completed the quiz with a score of ${score} out of ${totalQuestions}!`;
        scoreMessage.classList.add('text-xl', 'font-semibold');
        
        // Add custom message based on score
        let ratingMessage = '';
        const percentage = (score / totalQuestions) * 100;
        
        if (percentage === 100) {
            ratingMessage = "Perfect score! You're a shark anatomy expert!";
        } else if (percentage >= 80) {
            ratingMessage = "Excellent! You have a strong understanding of shark anatomy.";
        } else if (percentage >= 60) {
            ratingMessage = "Good job! You know quite a bit about shark anatomy.";
        } else if (percentage >= 40) {
            ratingMessage = "Not bad. With a little more study, you'll be a shark expert!";
        } else {
            ratingMessage = "Keep learning about sharks! They're fascinating creatures.";
        }
        
        // Clear previous content and add new messages
        completionMessage.innerHTML = '';
        completionMessage.appendChild(scoreMessage);
        
        const ratingElement = document.createElement('p');
        ratingElement.textContent = ratingMessage;
        ratingElement.classList.add('text-gray-700', 'mt-2');
        completionMessage.appendChild(ratingElement);
    }
    
    // Reset quiz for a new attempt
    function resetQuiz() {
        score = 0;
        answeredQuestions = 0;
        answeredPointIds.clear();
        attemptedPointIds.clear();
        updateProgressBar();
        
        // Reset point appearances and recreate all points
        createInteractivePoints();
    }
    
    // Wait for image to load before initializing quiz
    if (sharkImage) {
        if (sharkImage.complete) {
            initializeQuiz();
        } else {
            sharkImage.onload = initializeQuiz;
        }
    } else {
        // Failsafe if image isn't loaded yet
        setTimeout(initializeQuiz, 1000);
    }
});