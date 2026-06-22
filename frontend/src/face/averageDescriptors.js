export const averageDescriptors = (descriptors) => {
   if (!descriptors.length) return null;

   const average = new Array(128).fill(0);

   descriptors.forEach(descriptor => {
      descriptor.forEach((value, i) => {
         average[i] += value;
      });
   });

   return average.map(value => value / descriptors.length);
};