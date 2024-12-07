const Navbar = () => {
    return (
      <div className="h-screen w-64 bg-gray-800 text-white p-5">
        <div>
          
        </div>
        <ul>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded">
            <a href="#">Home</a>
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded">
            <a href="#">Settings</a>
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded">
            <a href="#">Profile</a>
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded">
            <a href="#">Messages</a>
          </li>
        </ul>
    </div>
    );
  };
  
  export default Navbar;
  