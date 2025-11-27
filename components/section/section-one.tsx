import ArticleOne from "./roby/article-one";
import ArticleTwo from "./roby/article-two";
import SectionBpkadDataSlide from "./roby/bpkad-slide";
import SectionPajakDataSlide from "./roby/pajak-slide";

export default function SectionOne() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 ">
        {/* <ArticleTree /> */}
        <div className="col-span-3">
          <SectionPajakDataSlide />
        </div>
        <div className="col-span-2">
          <SectionBpkadDataSlide />
        </div>
      </div>
    </>
  );
}
