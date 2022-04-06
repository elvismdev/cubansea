import { IoMdSnow } from "react-icons/io";
import { AiOutlineHeart } from "react-icons/ai";
import Image from "next/image";

const style = {
  topBar: `bg-[#303339] p-2 rounded-t-lg border-[#151c22] border`,
  topBarContent: `flex items-center`,
  likesCounter: `flex-1 flex items-center justify-end`,
};

const NFTImage = ({ selectedNft }) => {
  return (
    <div>
      <div className={style.topBar}>
        <div className={style.topBarContent}>
          <IoMdSnow />
          <div className={style.likesCounter}>
            <AiOutlineHeart />
            2.3K
          </div>
        </div>
      </div>
      <div>
        {/* {console.log(selectedNft, "🎆")} */}
        {selectedNft && (
          <Image src={selectedNft?.image} alt="" width={485} height={485} />
        )}
      </div>
    </div>
  );
};

export default NFTImage;
