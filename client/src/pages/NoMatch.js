import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div className="h-full">
      <div>
        <h3>Ohh! page not found</h3>
        <p>We can't seem to find the page you're looking for</p>
        <Link to="/">Click HERE to go back home</Link>
      </div>
    </div>
  );
};

export default NoMatch;
