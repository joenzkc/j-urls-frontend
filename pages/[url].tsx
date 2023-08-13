import { getFullUrl } from "@/components/api/apiHelper";
import { UrlDto } from "@/components/util/UrlDto";
import { GetServerSideProps } from "next";
import { useEffect } from "react";

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
  // const router = useRouter();
  useEffect(() => {
    window.location.href = dto.url;
  }, [dto.url]);

  return <div>Loading your page...</div>;
};

export default Url;
