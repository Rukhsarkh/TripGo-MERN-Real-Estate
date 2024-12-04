function MainScreen({ title, children }) {
  return (
    <div className="max-container max-sm:mt-60 sm:mt-48 md:mt-52 lg:mt-24">
      {title && (
        <h1 className="max-md:text-3xl md:text-5xl font-thin text-primary py-2 lg:px-2 max-xl:text-center">
          {title}
        </h1>
      )}
      <hr className="lg:mr-96 w-full mx-2" />
      {children}
    </div>
  );
}

export default MainScreen;
