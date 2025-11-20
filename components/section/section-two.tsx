import ArticleTree from "./roby/article-tree";
import SectionBpkadDataSlide from "./roby/bpkad-slide";
import SectionPajakDataSlide from "./roby/pajak-slide";
import SectionStuntingSweeperKecamatanSlide from "./roby/stunting-sweeper-kecamatan-slide";
import SectionTpidSlide from "./roby/tpid-pasar-slide";

export default function SectionTwo() {
  return (
    <>
      <div className="grid grid-cols- gap-4 ">
        {/* <ArticleTree /> */}
        <SectionPajakDataSlide />
      </div>
      <div className="grid grid-cols- gap-4 ">
        {/* <ArticleTree /> */}
        <SectionBpkadDataSlide />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {/* <ArticleTree /> */}
        <SectionStuntingSweeperKecamatanSlide />

        <SectionTpidSlide />
      </div>
    </>
  );
}
