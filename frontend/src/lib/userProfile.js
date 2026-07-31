const USER_PROFILE_KEY = 'mindsense_user_profile';

function formatNameFromEmail(email) {
  if (!email) return 'User';

  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'User';
}

export function getInitials(name, email) {
  const displayName = name || formatNameFromEmail(email);
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U';
}

export function getStoredUserProfile() {
  try {
    const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (!savedProfile) {
      return { name: 'User', email: '' };
    }

    const profile = JSON.parse(savedProfile);
    return {
      name: profile.name || formatNameFromEmail(profile.email),
      email: profile.email || '',
      picture: profile.picture || '',
    };
  } catch {
    return { name: 'User', email: '' };
  }
}

export function saveUserProfile(profile) {
  const nextProfile = {
    name: profile.name || formatNameFromEmail(profile.email),
    email: profile.email || '',
    picture: profile.picture || '',
  };

  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
}

export function decodeGoogleCredential(credential) {
  const payload = credential?.split('.')[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
