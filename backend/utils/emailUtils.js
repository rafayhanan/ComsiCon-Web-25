export const sendInviteEmail = async (email, password, teamName) => {
    console.log(`[Email Service] Invitation sent to ${email} for team ${teamName}`);
    console.log(`[Email Service] Temporary password: ${password}`);
    
    return true;
  };
  
  export const sendPasswordResetEmail = async (email, resetToken) => {
    console.log(`[Email Service] Password reset sent to ${email}`);
    console.log(`[Email Service] Reset token: ${resetToken}`);
    
    return true;
  };