function MainScreen({ title, children }) {
  return (
    <div className="max-container max-sm:mt-40 sm:mt-44 md:mt-48 lg:mt-20">
      {title && (
        <h1 className="max-md:text-3xl md:text-6xl lg:text-7xl lg:font-thin text-primary p-4 px-4 max-lg:text-center">
          {title}
        </h1>
      )}
      <hr className="lg:mr-96 w-full mx-2" />
      {children}
    </div>
  );
}

export default MainScreen;
