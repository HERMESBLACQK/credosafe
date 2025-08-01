// Mobile responsive utility classes and helpers
export const mobileResponsiveClasses = {
  // Container classes for different screen sizes
  container: {
    main: "w-full min-h-screen",
    content: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    contentSmall: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
    contentTight: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8",
  },
  
  // Padding classes for different screen sizes
  padding: {
    page: "py-4 sm:py-6 lg:py-8",
    section: "py-6 sm:py-8 lg:py-12",
    card: "p-4 sm:p-6 lg:p-8",
    form: "space-y-4 sm:space-y-6",
  },
  
  // Grid classes for responsive layouts
  grid: {
    responsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    twoColumn: "grid grid-cols-1 lg:grid-cols-2",
    threeColumn: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    fourColumn: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  },
  
  // Text classes for responsive typography
  text: {
    h1: "text-2xl sm:text-3xl lg:text-4xl font-bold",
    h2: "text-xl sm:text-2xl lg:text-3xl font-bold",
    h3: "text-lg sm:text-xl lg:text-2xl font-semibold",
    body: "text-sm sm:text-base",
    small: "text-xs sm:text-sm",
  },
  
  // Button classes for responsive buttons
  button: {
    primary: "w-full sm:w-auto px-4 py-2 sm:py-3 text-sm sm:text-base",
    secondary: "w-full sm:w-auto px-3 py-2 sm:py-3 text-sm",
    icon: "w-8 h-8 sm:w-10 sm:h-10 p-1 sm:p-2",
  },
  
  // Form classes for responsive forms
  form: {
    input: "w-full px-3 py-2 sm:py-3 text-sm sm:text-base",
    label: "block text-sm font-medium mb-1 sm:mb-2",
    group: "space-y-3 sm:space-y-4",
  },
  
  // Card classes for responsive cards
  card: {
    base: "bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md",
    padding: "p-4 sm:p-6 lg:p-8",
    header: "p-4 sm:p-6 border-b border-neutral-200",
    body: "p-4 sm:p-6",
    footer: "p-4 sm:p-6 border-t border-neutral-200",
  },
  
  // Modal classes for responsive modals
  modal: {
    container: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4",
    content: "relative bg-white rounded-lg sm:rounded-xl shadow-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6",
    backdrop: "absolute inset-0 bg-black/50 backdrop-blur-sm",
  },
  
  // Navigation classes for responsive navigation
  nav: {
    header: "bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50",
    content: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    item: "flex items-center space-x-2 text-sm sm:text-base",
  },
  
  // Footer classes for responsive footer
  footer: {
    container: "fixed bottom-0 left-0 right-0 z-50",
    content: "max-w-sm mx-auto px-2 sm:px-3 pb-2 sm:pb-3",
    item: "flex flex-col items-center space-y-1",
    icon: "w-6 h-6 sm:w-8 sm:h-8",
    text: "text-xs sm:text-sm font-medium",
  },
};

// Helper function to get responsive classes
export const getResponsiveClass = (baseClass, mobileClass = "", tabletClass = "", desktopClass = "") => {
  return `${baseClass} ${mobileClass} sm:${tabletClass} lg:${desktopClass}`.trim();
};

// Helper function for responsive spacing
export const getResponsiveSpacing = (mobile, tablet, desktop) => {
  return `p-${mobile} sm:p-${tablet} lg:p-${desktop}`;
};

// Helper function for responsive text sizes
export const getResponsiveText = (mobile, tablet, desktop) => {
  return `text-${mobile} sm:text-${tablet} lg:text-${desktop}`;
};

// Helper function for responsive grid columns
export const getResponsiveGrid = (mobile, tablet, desktop, xl = null) => {
  let classes = `grid grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`;
  if (xl) {
    classes += ` xl:grid-cols-${xl}`;
  }
  return classes;
};

// Common mobile responsive patterns
export const mobilePatterns = {
  // Page container with proper spacing
  pageContainer: "min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-16 sm:pb-20 lg:pb-24",
  
  // Main content area
  mainContent: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8",
  
  // Form container
  formContainer: "max-w-md sm:max-w-lg lg:max-w-xl mx-auto w-full space-y-4 sm:space-y-6",
  
  // Card container
  cardContainer: "bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8",
  
  // Button group
  buttonGroup: "flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4",
  
  // Input group
  inputGroup: "space-y-3 sm:space-y-4",
  
  // Modal content
  modalContent: "relative bg-white rounded-lg sm:rounded-xl shadow-xl max-w-sm sm:max-w-md lg:max-w-lg w-full p-4 sm:p-6 lg:p-8",
  
  // Navigation header
  navHeader: "bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50",
  
  // Floating footer
  floatingFooter: "fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto px-2 sm:px-3 pb-2 sm:pb-3",
};

export default {
  mobileResponsiveClasses,
  getResponsiveClass,
  getResponsiveSpacing,
  getResponsiveText,
  getResponsiveGrid,
  mobilePatterns,
}; 