function Profile(){
  const user = JSON.parse(localStorage.getItem('user')); 

  return(
    <div>
      <h1>My Profile</h1>
      {user? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user info</p>
      )}
    </div>
  );
}

export default Profile; 