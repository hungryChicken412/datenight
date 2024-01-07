import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
	return (
		<main className={styles.main}>
			<div>
				Get started <Link href="/login">oosdf</Link>
			</div>
		</main>
	);
}
