const Home = () => {
  return (
    <div className="justify-center flex-col  w-full mt-32 pb-24 md:pb-5 p-5">
      <div className="text-center ">
        <h1 className="">Getting Started</h1>
        <p className="">Welcome to Shortlists!</p>
      </div>
      <div className="mt-20 ml-80">
        <h4>Here are the basics</h4>
        <ul>
          <li className="">
            Create a list by either clicking "Create" in the top right or
            clicking the + sign next to Classic or Social on the sidebar on the
            left
          </li>
          <li>You're given 2 options</li>
          <li>Classic - a standard personal list for you to add items to</li>
          <li>
            Social - a list you can add collaboratively to with friends, family
            or coworkers
          </li>
          <li>
            Don't worry classic lists can always be turned into social lists
            later
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
