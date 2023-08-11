import { getAllHashedUrls, getFullUrl } from "@/components/api/apiHelper";
import { UrlDto } from "@/components/util/UrlDto";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { url } = ctx.params as { url: string };
    const dto: UrlDto = await getFullUrl(url);
    return { props: { dto } };
  } catch (err) {
    return { notFound: true };
  }
};

const Url: React.FC<{ dto: UrlDto }> = ({ dto }) => {
  console.log(dto);
  return <div>[url]</div>;
};

export default Url;
