function MainScreen({ title, children }) {
  return (
    <div className="max-container my-20">
      {title && <h1 className="text-6xl font-thin text-primary">{title}</h1>}
      <hr className="mr-96" />
      {children}
    </div>
  );
}

export default MainScreen;
