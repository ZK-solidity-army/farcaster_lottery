import scaffoldConfig from "~~/scaffold.config";
import { contracts } from "~~/src/utils/scaffold-eth/contract";

export function getAllContracts() {
  const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].id];
  return contractsData ? contractsData : {};
}
