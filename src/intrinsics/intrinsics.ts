import { BoundFunction } from "../vm/funcdef";
import { HashMap } from "../vm/hashmap";
import { Processor } from "../vm/processor";
import { addBitOperationIntrinsics } from "./standard/bitOperations";
import { addCharIntrinsics } from "./standard/chars";
import { addCollectionIntrinsics } from "./standard/collections";
import { addConversionIntrinsics } from "./standard/conversion";
import { addCoreTypesIntrinsics } from "./standard/coreTypes";
import { addIdentityIntrinsics } from "./standard/identity";
import { addMathIntrinsics } from "./standard/math";
import { addPrintIntrinsic } from "./standard/print";
import { addRandomnessIntrinsics } from "./standard/randomness";
import { addSchedulingIntrinsics } from "./standard/scheduling";
import { addStringIntrinsics } from "./standard/string";


export function addStandardIntrinsics(p: Processor) {
  addPrintIntrinsic(p);
  
  addCoreTypesIntrinsics(p);

  addMathIntrinsics(p);
  addBitOperationIntrinsics(p);
  addCharIntrinsics(p);
  addCollectionIntrinsics(p);
  addConversionIntrinsics(p);
  addIdentityIntrinsics(p);
  addRandomnessIntrinsics(p);
  addSchedulingIntrinsics(p);
  addStringIntrinsics(p);

  // Once all other intrinsics have been created, add some of them
  // to the base type maps.
  addBaseTypesIntrinsics(p);
}

function addBaseTypesIntrinsics(p: Processor) {

  const listIntrinsicNames = ["len", "indexOf", "indexes", "hasIndex", "sum",
    "sort", "push", "pull", "pop", "values", "insert", "remove", "replace",
    "join", "shuffle"];
  const stringIntrinsicNames = ["len", "indexOf", "indexes", "hasIndex", "upper", 
    "lower", "values", "insert", "remove", "replace", "split", "val", "code"];
  const mapIntrinsicNames = ["len", "indexOf", "indexes", "hasIndex", "sum",
    "push", "pull", "pop", "values", "remove", "replace", "shuffle"];

  const getFn = (name: string): BoundFunction => {
    const optFn = p.globalContext.getOpt(name);
    if (optFn !== undefined) {
      return optFn;
    } else {
      throw new Error("Intrinsic not found: " + name);
    }
  };

  const importIntrinsics = (targetList: HashMap, intrinsicNames: string[]) => {
    for (let fnName of intrinsicNames) {
      const boundFn = getFn(fnName);
      const argNames = boundFn.funcDef.argNames;
      if (argNames.length < 1 || argNames[0] !== "self") {
        throw new Error(`First parameter of ${fnName} must be 'self'. Found: ${argNames}`);
      }
      p.attachExistingIntrinsic(targetList, fnName, boundFn);
    }
  };

  importIntrinsics(p.listCoreType, listIntrinsicNames);
  importIntrinsics(p.mapCoreType, mapIntrinsicNames);
  importIntrinsics(p.stringCoreType, stringIntrinsicNames);
}