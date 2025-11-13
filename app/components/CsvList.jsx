import { useGlobalStore } from "@/app/store/useGlobalStore";

export default function CsvList() {
  const csvArray = useGlobalStore((state) => state.csvArray);

  const csvs = csvArray.map((csv) => {
    return (
      <li key={csv}>
        <a href="/results">{csv}</a>
      </li>
    );
  });

  return (
    <section>
      <h3>This is the CsvList Component</h3>
      <ul>{csvs}</ul>
    </section>
  );
}
