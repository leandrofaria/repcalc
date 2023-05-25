import styles from "./featureContainer.module.css";

const FeatureContainer = ({ children }) => {
  return <section className={styles.container}>{children}</section>;
};

export default FeatureContainer;
