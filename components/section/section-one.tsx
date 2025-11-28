import ColumnSectionOneLeft from "./colum/colum-section-one-left";
import ColumnSectionOneRight from "./colum/colum-section-one-right";

export default function SectionOne() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 ">
        {/* <ArticleTree /> */}
        <div className="col-span-3">
          <ColumnSectionOneLeft />
        </div>
        <div className="col-span-2">
          <ColumnSectionOneRight />
        </div>
      </div>
    </>
  );
}
