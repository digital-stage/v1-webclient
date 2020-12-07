import { AuthError, ErrorCodes } from '../../lib/useAuth';

const translateError = (error: AuthError): string => {
  switch (error.code) {
    case ErrorCodes.Unauthorized: {
      return 'Unbekannte E-Mail-Adresse oder falsches Passwort';
    }
    case ErrorCodes.NotActivated: {
      return 'Bitte aktiviere Deinen Account!';
    }
    case ErrorCodes.NotFound: {
      return 'E-Mail Adresse nicht gefunden!';
    }
    case ErrorCodes.EmailAlreadyInUse: {
      return 'Die E-Mail-Adresse wird bereits genutzt!';
    }
    case ErrorCodes.InvalidToken: {
      return 'Ungültiger oder abgelaufener Code';
    }
    default: {
      return 'Unbekannter Fehler: ' + error.code;
    }
  }
};
export default translateError;
