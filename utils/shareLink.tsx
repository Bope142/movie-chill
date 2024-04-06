import { toast } from "react-toastify";

interface ShareOnSocialMediaProps {
  link: string;
  message: string;
}

const shareOnSocialMedia = async (link: string, message: string) => {
  try {
    if (navigator.share) {
      const shareMessage = `${message} - 🤩 MOVIE CHILL \n\n${link}`;
      await navigator.share({
        title: "Movie Chill 🤩",
        text: shareMessage,
      });
      console.log("Shared successfully");
    } else {
      console.log("Sharing not supported, opening fallback");
    }
  } catch (error) {
    console.error("Error sharing:", error);
  }
};

export default shareOnSocialMedia;
